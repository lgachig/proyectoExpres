module "app" {
  source        = "../../modules/ec2-app"
  environment   = "qa"
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t2.micro"
}