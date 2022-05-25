git clone https://github.com/ahnochen/project.git

cd project

# RUN npm install
npm install


cd /root
mkdir .aws
mv /app/config ~/.aws
mv /app/credentials ~/.aws

cd /app
node app.js



