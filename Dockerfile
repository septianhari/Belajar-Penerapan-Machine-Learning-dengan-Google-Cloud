# Gunakan Node.js LTS sebagai base image
FROM node:18

# Set directory kerja dalam container
WORKDIR /app

# Salin package.json dan package-lock.json ke container
COPY package*.json ./

# Install dependencies
RUN npm install

ENV MODEL_URL 'https://storage.googleapis.com/prediksi-kanker/submissions-model/model.json'

# Salin semua file aplikasi ke dalam container
COPY . .

# Ekspose port aplikasi (ganti jika aplikasi berjalan di port lain)
EXPOSE 3001

# Jalankan aplikasi
CMD ["npm", "run", "start:dev"]
