output "instance_id" {
    value = google_compute_instance.frontend.instance_id
    description = "Instancia de frontend"
  
}

output "public_ip" {
    value = google_compute_instance.frontend.network_interface[0].access_config[0].nat_ip
    description = "IP publica de la instancia de frontend"
  
}