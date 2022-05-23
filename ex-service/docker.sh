curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip ./awscliv2.zip
./aws/install

git clone https://github.com/ahnochen/project.git

cd project

# RUN npm install
npm install

aws --version
git --version
cdk --version

