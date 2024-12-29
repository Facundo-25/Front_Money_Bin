resource "tls_private_key" "example_ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "private_key" {
  content         = tls_private_key.example_ssh.private_key_pem
  filename        = "${path.module}/example-key.pem"
  file_permission = "0600"
}

resource "local_file" "public_key" {
  content  = tls_private_key.example_ssh.public_key_openssh
  filename = "${path.module}/example-key.pub"
}

resource "google_compute_instance" "frontend" {
  name         = var.instance_name
  machine_type = "e2-small"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-2004-focal-v20240307b"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata = {
    ssh-keys = "sfmx:${tls_private_key.example_ssh.public_key_openssh}"
  }

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "sfmx"
      private_key = tls_private_key.example_ssh.private_key_pem
      host        = self.network_interface[0].access_config[0].nat_ip
    }

    inline = [
      # Actualizar los paquetes existentes
      "sudo apt-get update",

      # Instalar paquetes necesarios para añadir repositorios y otras dependencias
      "sudo apt-get install -y software-properties-common apt-transport-https ca-certificates curl",

      # Añadir el repositorio de Ansible
      "sudo add-apt-repository --yes --update ppa:ansible/ansible",
      "sudo apt-get install -y ansible",

      # Añadir la clave GPG oficial de Docker
      "sudo install -m 0755 -d /etc/apt/keyrings",
      "sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc",
      "sudo chmod a+r /etc/apt/keyrings/docker.asc",

      # Añadir el repositorio de Docker
      "echo \"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null",
      "sudo apt-get update",

      # Instalar Docker y dependencias
      "sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin"
    ]


  }

  # Agregar el archivo prvisioner para copiar la carpeta local al destino remoto
  provisioner "file" {
    source      = "/home/sfmx/Downloads/pruebas/ansible"
    destination = "/home/sfmx/ansible"

    connection {
      type        = "ssh"
      user        = "sfmx"
      private_key = tls_private_key.example_ssh.private_key_pem
      host        = self.network_interface[0].access_config[0].nat_ip
    }
  }

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "sfmx"
      private_key = tls_private_key.example_ssh.private_key_pem
      host        = self.network_interface[0].access_config[0].nat_ip
    }

    inline = [
      "ansible-playbook /home/sfmx/ansible/playbook.yml"
    ]
  }
}

resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["3000"]
  }

  source_ranges = ["0.0.0.0/0"]
}
