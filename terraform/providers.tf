terraform {
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.60"
    }
  }
}


provider "google" {
  project     = "rugged-feat-445700-c0"
  region      = "us-central1"
  credentials = file("./key.json")
}