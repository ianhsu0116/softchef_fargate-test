apt-get update
apt-get upgrade
apt-get install git
curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install


git clone https://github.com/ahnochen/project.git

cd project

# RUN npm install
npm install

cd ..

node index.js