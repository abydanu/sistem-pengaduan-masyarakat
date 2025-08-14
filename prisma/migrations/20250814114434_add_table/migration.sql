-- CreateTable
CREATE TABLE `masyarakat` (
    `nik` CHAR(16) NOT NULL,
    `username` VARCHAR(25) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `nama` VARCHAR(35) NOT NULL,
    `telp` VARCHAR(13) NOT NULL,

    UNIQUE INDEX `masyarakat_username_key`(`username`),
    PRIMARY KEY (`nik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengaduan` (
    `id_pengaduan` INTEGER NOT NULL AUTO_INCREMENT,
    `tgl_pengaduan` DATE NOT NULL,
    `nik` CHAR(16) NOT NULL,
    `isi_laporan` TEXT NOT NULL,
    `foto` LONGTEXT NOT NULL,
    `status` ENUM('0', 'proses', 'selesai') NOT NULL,

    PRIMARY KEY (`id_pengaduan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `petugas` (
    `id_petugas` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_petugas` VARCHAR(35) NOT NULL,
    `username` VARCHAR(25) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `telp` VARCHAR(13) NOT NULL,
    `level` ENUM('admin', 'petugas') NOT NULL,

    UNIQUE INDEX `petugas_username_key`(`username`),
    PRIMARY KEY (`id_petugas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tanggapan` (
    `id_tanggapan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pengaduan` INTEGER NOT NULL,
    `tgl_tanggapan` DATE NOT NULL,
    `tanggapan` TEXT NOT NULL,
    `id_petugas` INTEGER NOT NULL,

    PRIMARY KEY (`id_tanggapan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pengaduan` ADD CONSTRAINT `pengaduan_nik_fkey` FOREIGN KEY (`nik`) REFERENCES `masyarakat`(`nik`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tanggapan` ADD CONSTRAINT `tanggapan_id_pengaduan_fkey` FOREIGN KEY (`id_pengaduan`) REFERENCES `pengaduan`(`id_pengaduan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tanggapan` ADD CONSTRAINT `tanggapan_id_petugas_fkey` FOREIGN KEY (`id_petugas`) REFERENCES `petugas`(`id_petugas`) ON DELETE CASCADE ON UPDATE CASCADE;
