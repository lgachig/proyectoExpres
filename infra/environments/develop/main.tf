module "app" {
  source        = "../../modules/ec2-app"
  environment   = "develop"
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t2.micro"
}