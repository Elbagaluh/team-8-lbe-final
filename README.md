# team-8-lbe-final

Anggota : 

| Name           | NRP        |
| ---            | ---        | 
| Elba Galuh Hardiyanti            | 5025251025        | 
| M. Fausta Putra Kavie            | 5025251110        | 
| Nabila Zalfaa Putri Hamid            | 5025251089        | 
| Maida Aqillah Putri Nurandani            | 5025251122        | 

Pada final project ini, kelompok kami menerapkan konsep load balancing menggunakan Azure untuk membangun sistem yang mampu mendistribusikan traffic ke beberapa virtual machine. Setiap virtual machine menjalankan aplikasi berbasis Docker, kemudian seluruhnya dihubungkan melalui Azure Standard Load Balancer. Melalui project ini, kami tidak hanya mengimplementasikan konfigurasi load balancer, tetapi juga melakukan pengujian untuk membuktikan bahwa traffic dapat didistribusikan ke beberapa backend secara efektif.

## 1. Pembuatan Resource Group

<img width="599" height="387" alt="image" src="https://github.com/user-attachments/assets/499effef-a0da-40a4-a6cd-d41794ddba62" />

Pembuatan resource group dilakukan sesuai dengan langkah-langkah yang ada di dalam modul. Kami menggunakan Region East-Asia dikarenakan region tersebut adalah region yang dapat diakses seluruh anggota tim kami.

## 2. Pembuatan Virtual Network
<img width="956" height="232" alt="image" src="https://github.com/user-attachments/assets/dea831e6-f23d-47ad-8486-2be2a6dc9866" />
Pada project ini, kelompok kami menggunakan Virtual Network (VNet) dengan nama vn-team08 sebagai jaringan virtual yang menghubungkan seluruh Virtual Machine (VM) dalam satu jaringan. Setiap VM ditempatkan pada VNet yang sama agar dapat terhubung dan digunakan sebagai backend pool pada Azure Load Balancer. Dengan konfigurasi ini, komunikasi antara VM dan Load Balancer dapat berjalan dalam satu lingkungan jaringan yang terintegrasi.

## 3. Pembuatan VM setiap anggota 

### vm-galuh
VM ini merupakan VM utama milik kelompok kami. dikarenakan penggunaan public ip yang terbatas, kami mengunakan vm-galuh sebagai VM utama sehingga proses login VM seluruh anggota kelompok bergantung pada vm tersebut dan seluruh vm anggota lainnya menggunakan public ip none (seperti pada video tutorial). 
<img width="950" height="441" alt="image" src="https://github.com/user-attachments/assets/26dceaf8-66f4-4988-afee-04773c9e8232" />
VM ini menjalankan Ubuntu 22.04 LTS dengan ukuran Standard_B1s. VM ini terhubung ke Virtual Network vn-team08 dan digunakan untuk menjalankan aplikasi berbasis Docker. Selanjutnya, VM vm-galuh ditempatkan sebagai salah satu backend pada Azure Load Balancer untuk menerima dan melayani traffic dari pengguna.

### vm-mai
<img width="950" height="424" alt="image" src="https://github.com/user-attachments/assets/1ade36e2-860d-454f-87dc-d4551a784267" />

### vm-nabila
<img width="953" height="440" alt="image" src="https://github.com/user-attachments/assets/75befa97-ea07-4e13-b6ac-faa84f29a62f" />

### vm-team08-kavie
<img width="950" height="438" alt="image" src="https://github.com/user-attachments/assets/5cf8a050-e4f3-4784-8e4a-bffc2e1dc895" />

## 4. Konfigurasi NSG 
<img width="765" height="292" alt="image" src="https://github.com/user-attachments/assets/c5c53c9f-61f8-498b-b9f6-72c10a078211" />
Pada konfigurasi inbound rules, terdapat beberapa aturan yang mengizinkan akses melalui HTTP pada port 80, HTTPS pada port 443, SSH pada port 22, serta aplikasi pada port 8080. Rule App pada port 8080 digunakan untuk mengizinkan akses menuju aplikasi yang berjalan di dalam Docker container. Selain itu, terdapat rule bawaan Azure untuk mengizinkan traffic dari Virtual Network dan Azure Load Balancer, serta rule DenyAllInBound sebagai aturan penolakan terhadap traffic masuk yang tidak diizinkan. Konfigurasi ini memungkinkan VM menerima traffic yang diperlukan sekaligus tetap menerapkan kontrol terhadap akses jaringan. Pengaturan NSG ini kami terapkan tidak hanya pada satu VM, namun kami tetapkan pada seluruh vm yang ada.

## 5. Pembuatan Load Balancer
<img width="1600" height="727" alt="Traffic Load Balancer" src="https://github.com/user-attachments/assets/2582eda0-e3e6-4e53-b8f3-d9ccf41bb5b3" />
Azure Load Balancer load-balancer-team8 dibuat untuk mendistribusikan lalu lintas jaringan secara otomatis ke tiga mesin virtual (vm-mai, vm-galuh, dan vm-team08-kavie). Akses masuk dari klien diterima melalui titik gerbang frontend-team8, lalu disalurkan lewat aturan lb-rule-8080 menuju backend-pool. Seluruh VM target sudah terhubung dengan baik dan berstatus sehat (centang hijau)

## 6. Penambahan Website Portofolio
0. Gambaran akhir

Target kita:

                 INTERNET
                    │
                    ▼
          Azure Load Balancer
          20.255.222.11:8080
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      VM Galuh             VM Mai
      :8080                 :8080
        │                     │
        ▼                     ▼
   Docker Portfolio      Docker Portfolio
      :3000                  :3000


Di setiap VM:

Host port 8080 -> Container port 3000 -> Express Portfolio

Jadi command Docker finalnya:

``docker run -d --name portfolio -p 8080:3000 portfolio:latest``

1. Siapkan source portfolio di komputer

Misalnya portfolio ada di Windows:

``C:\Users\elbag\portofolio``

Struktur minimalnya:

portofolio/
├── client/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── images/        # kalau ada
├── server/
│   └── app.js
└── package.json

Kalau source kamu belum punya package.json, buat:
```
{
  "name": "portfolio",
  "version": "1.0.0",
  "main": "server/app.js",
  "scripts": {
    "start": "node server/app.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

Pastikan server/app.js menjalankan Express di port 3000, misalnya:
```
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "../client")));

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio running on port ${PORT}`);
});
```
0.0.0.0 penting supaya aplikasi bisa menerima koneksi dari luar container.

2. Jangan kirim node_modules

Kalau di komputer ada:

portofolio/
└── node_modules/

jangan ikut dikirim ke VM.

Docker nanti yang melakukan:
``
RUN npm install
``
Tambahkan .gitignore:
``
node_modules/
npm-debug.log
``
3. Buat Dockerfile

Di folder utama portfolio:

portofolio/
├── client/
├── server/
├── package.json
└── Dockerfile

Isi Dockerfile:
```
FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY client ./client
COPY server ./server

EXPOSE 3000

CMD ["npm", "start"]
```
Kenapa portnya 3000? Karena Express di dalam container berjalan di 3000.

mapping:

``8080:3000``

Artinya:

VM:8080 → Docker:3000

4. Copy portfolio dari Windows ke VM Galuh
<img width="451" height="62" alt="image" src="https://github.com/user-attachments/assets/e7a68698-aad3-4cae-bce9-f784d1375971" />

Misalnya kamu punya folder:

``C:\Users\elbag\portofolio``

Dan VM Galuh bisa diakses dengan:

``galuh@PUBLIC-IP-GALUH`` Dari PowerShell Windows

Jalankan:

``scp -r "C:\Users\elbag\portofolio" galuh@<PUBLIC-IP-GALUH>:~/portofolio``

Contoh:

``scp -r "C:\Users\elbag\portofolio" galuh@20.x.x.x:~/portofolio``

Kalau diminta password, masukkan password VM Galuh.




5. Masuk ke Galuh
<img width="340" height="362" alt="image" src="https://github.com/user-attachments/assets/542d43f9-47ce-4ec8-91f9-504731409eea" />

``ssh galuh@<PUBLIC-IP-GALUH>``

Lalu:

``cd ~/portofolio``

Cek:

``ls -la``

maka akan kelihatan :
```
client
server
package.json
Dockerfile
```

Cek source:

``ls client``

dan:
``
ls server``

6. Pastikan Dockerfile benar
``cat Dockerfile``

Harus:

```
FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY client ./client
COPY server ./server

EXPOSE 3000

CMD ["npm", "start"]
```

7. Build Docker image di Galuh
<img width="458" height="306" alt="image" src="https://github.com/user-attachments/assets/2d20511e-a4a9-4b98-b1d5-2d474bb96e08" />

Masih di:

``~/portofolio``

jalankan:

``docker build -t portfolio:latest .``

Tunggu sampai selesai.

Cek:
``
docker images | grep portfolio
``
Hasilnya kurang lebih:

``portfolio    latest    xxxxxxxxxxxx    ...    ...``

Kalau sudah ada, berarti image berhasil dibuat.

8. Test image di Galuh dulu

Jangan langsung port 8080 kalau port tersebut sedang digunakan aplikasi lama.
Untuk testing awal, gunakan port sementara, misalnya 8081:

``docker run -d --name portfolio-test -p 8081:3000 portfolio:latest``

Cek:

``docker ps``

Lalu:

``curl -I http://localhost:8081``

Target:

``HTTP/1.1 200 OK``

Kalau 200 OK, image dan aplikasinya sehat.

Setelah test:
``
docker stop portfolio-test
docker rm portfolio-test
``

9. Kalau Galuh mau langsung menjadi backend port 8080

Kalau Galuh memang salah satu backend Load Balancer dan port 8080 harus dipakai, pastikan tidak ada container lain yang memakai 8080:

``docker ps --format "table {{.Names}}\t{{.Ports}}"``

Kalau ada container lama, misalnya:

``breakout    0.0.0.0:8080->8080/tcp``

dan memang mau diganti dengan portfolio:

``docker stop breakout``

Jangan langsung hapus dulu:

``docker rm breakout``

boleh dilakukan setelah portfolio terbukti berjalan.

Kemudian:

``docker run -d --name portfolio -p 8080:3000 portfolio:latest``

Test:

``curl -I http://localhost:8080``

Target:
``
HTTP/1.1 200 OK
``

10. Buat .tar dari Docker image
<img width="356" height="29" alt="image" src="https://github.com/user-attachments/assets/4c41cbbc-cbb4-4be4-a67a-041e4ceaafb3" />

Ini bagian penting karena VM Mai kita tidak punya outbound internet untuk menarik node:20-alpine dari Docker Hub.
Jadi kita build sekali di Galuh, kemudian kirim image yang sudah jadi.

Di Galuh:

``docker save portfolio:latest -o ~/portfolio.tar``

Cek:

``ls -lh ~/portfolio.tar``

Contoh hasil kita :

``-rw------- 1 galuh galuh 49M Sep 23 08:51 /home/galuh/portfolio.tar``

11. Transfer image .tar dari Galuh ke Mai

Karena Mai berada di private network dan bisa diakses dari Galuh:

Galuh
  ↓
10.0.0.5
  ↓
Mai

Dari Galuh:

``scp ~/portfolio.tar mai@10.0.0.5:~/portfolio.tar``

Masukkan password Mai.

Setelah selesai, masuk ke Mai:

``ssh mai@10.0.0.5``

Cek:

``ls -lh ~/portfolio.tar``

Harus ada file sekitar puluhan MB.

12. Load image ke Docker Mai
<img width="450" height="30" alt="image" src="https://github.com/user-attachments/assets/970e6a55-8fc8-4dab-a888-1f7ec61b1868" />

Di Mai:

``docker load -i ~/portfolio.tar``

Target:

``Loaded image: portfolio:latest``

Cek:

``docker images | grep portfolio``

Harus muncul:

``portfolio    latest    xxxxxxxxxxxx    ...``

13. Jangan build di Mai

Ini penting untuk kondisi VM kita.

Jangan lakukan:

``docker build ...``

di Mai kalau Dockerfile menggunakan:

``FROM node:20-alpine``

karena Mai tidak punya akses internet keluar untuk mengambil base image.

Kita sudah menyelesaikan masalah itu dengan:

Galuh
   │
   ├── docker build
   │
   ├── docker save
   │
   └── portfolio.tar
             │
             ▼
           Mai
             │
             └── docker load
             
14. Ganti aplikasi lama di Mai

Misalnya sebelumnya Mai menjalankan:

``breakout``

0.0.0.0:8080->8080

Cek dulu:

``docker ps --format "table {{.Names}}\t{{.Ports}}"``

Kalau memang breakout memakai 8080 dan mau diganti:

``docker stop breakout``

Jangan buru-buru hapus container.

15. Jalankan portfolio di Mai pada port 8080
<img width="338" height="134" alt="image" src="https://github.com/user-attachments/assets/d7f83734-8724-49c7-8fb2-acb4dbbe180d" />

``docker run -d --name portfolio -p 8080:3000 portfolio:latest``

Cek:

``docker ps``

Harus ada:

``portfolio    portfolio:latest    ...    0.0.0.0:8080->3000/tcp``

16. Test langsung di Mai

Pertama:

``curl -I http://localhost:8080``

Target:

``HTTP/1.1 200 OK``

Kemudian:

``curl http://localhost:8080 | head``

Kalau muncul:
```
<!DOCTYPE html>
<html lang="id">
<head>
...
<title>Portofolio ...</title>
```

berarti portfolio sudah benar-benar berjalan.
Kalau muncul:

``curl: Failed writing body``

setelah menggunakan | head, itu bukan berarti aplikasi rusak. head memang berhenti membaca setelah beberapa baris.

17. Pastikan port 8080 listening

Di Mai:

``ss -lntp | grep 8080``

Target:
```
LISTEN ... 0.0.0.0:8080
LISTEN ... [::]:8080
```
Ini menunjukkan port 8080 terbuka pada interface VM.

18. Test dari Galuh ke Mai

Keluar dari Mai:

``exit``

Sekarang kamu kembali ke Galuh.

Test:

``curl -I http://10.0.0.5:8080``

Target:

``HTTP/1.1 200 OK``

Kalau ini berhasil, berarti:

Galuh
   ↓
10.0.0.5:8080
   ↓
Docker Mai
   ↓
Portfolio

sudah aman.

19. Test melalui Azure Load Balancer

Sekarang bagian yang paling penting.

Dari Galuh:

``curl -I http://20.255.222.11:8080``

Target:

``HTTP/1.1 200 OK``

Kalau berhasil:

20.255.222.11:8080
        ↓
Azure Load Balancer
        ↓
Mai:8080
        ↓
Portfolio

sudah berjalan.

20. Buka portfolio dari browser
<img width="1600" height="860" alt="image" src="https://github.com/user-attachments/assets/a10f3ad4-9ba1-4efd-8bc6-4a47e2b839b7" />
<img width="1600" height="860" alt="image" src="https://github.com/user-attachments/assets/6d8336df-ac8b-49dc-8b48-f72c0df5dfed" />


Di komputer buka:

``http://20.255.222.11:8080``

Bukan:

``http://10.0.0.5:8080``

kenapa? karena 10.0.0.5 adalah private IP Mai.

Yang dipakai user dari internet adalah:

``http://20.255.222.11:8080``

Kalau halaman portfolio muncul, deployment berhasil. 🎉






