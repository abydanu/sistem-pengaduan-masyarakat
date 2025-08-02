"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Menu, X, MessageSquare, Users, Clock, Shield, Phone, Mail, MapPin, ChevronDown } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-emerald-600" />,
      title: "Pelaporan Mudah",
      description: "Laporkan keluhan Anda dengan mudah melalui formulir online yang sederhana dan user-friendly."
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      title: "Transparansi Penuh",
      description: "Pantau status pengaduan Anda secara real-time dan dapatkan update progress penanganan."
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-600" />,
      title: "Respon Cepat",
      description: "Tim kami berkomitmen memberikan respon dalam 24 jam untuk setiap pengaduan yang masuk."
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-600" />,
      title: "Data Aman",
      description: "Semua data pengaduan Anda terlindungi dengan sistem keamanan tingkat tinggi."
    }
  ];

  const faqs = [
    {
      question: "Bagaimana cara membuat pengaduan?",
      answer: "Anda dapat membuat pengaduan dengan mengklik tombol 'Buat Pengaduan', mengisi formulir yang tersedia, dan mengirimkan dokumen pendukung jika diperlukan."
    },
    {
      question: "Berapa lama waktu penanganan pengaduan?",
      answer: "Waktu penanganan bervariasi tergantung kompleksitas masalah. Namun, kami berkomitmen memberikan respon awal dalam 24 jam dan menyelesaikan dalam 7-14 hari kerja."
    },
    {
      question: "Apakah saya bisa melacak status pengaduan?",
      answer: "Ya, Anda akan mendapatkan nomor tiket dan dapat melacak status pengaduan melalui portal online atau aplikasi mobile kami."
    },
    {
      question: "Apakah layanan ini gratis?",
      answer: "Ya, layanan pengaduan masyarakat ini sepenuhnya gratis untuk seluruh warga negara Indonesia."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-slate-900 shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-emerald-400">SiPengMas</h1>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="flex items-center">
                <a href="#beranda" className="text-gray-300 hover:text-emerald-400 px-3 py-2 text-sm font-medium transition-colors">Beranda</a>
                <a href="#layanan" className="text-gray-300 hover:text-emerald-400 px-3 py-2 text-sm font-medium transition-colors">Layanan</a>
                <a href="#tentang" className="text-gray-300 hover:text-emerald-400 px-3 py-2 text-sm font-medium transition-colors">Tentang</a>
                <a href="#kontak" className="text-gray-300 hover:text-emerald-400 px-3 py-2 text-sm font-medium transition-colors">Kontak</a>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white hover:cursor-pointer" onClick={() => router.push("/masuk")}>
                  Buat Pengaduan
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-300 hover:text-emerald-400">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#beranda" className="block px-3 py-2 text-gray-300 hover:text-emerald-400">Beranda</a>
              <a href="#layanan" className="block px-3 py-2 text-gray-300 hover:text-emerald-400">Layanan</a>
              <a href="#tentang" className="block px-3 py-2 text-gray-300 hover:text-emerald-400">Tentang</a>
              <a href="#kontak" className="block px-3 py-2 text-gray-300 hover:text-emerald-400">Kontak</a>
              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white hover:cursor-pointer" onClick={() => router.push("/masuk")}>
                Buat Pengaduan
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="pt-16 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in">
                Sistem Pengaduan 
                <span className="text-emerald-400"> Masyarakat</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                Platform digital untuk menyampaikan keluhan, saran, dan aspirasi Anda kepada pemerintah dengan mudah, cepat, dan transparan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 text-lg rounded-lg hover:cursor-pointer" onClick={() => router.push("/masuk")}>
                  Buat Pengaduan Sekarang
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="h-4 bg-white/20 rounded w-2/3"></div>
                  <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="layanan" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Mengapa Memilih SiPengMas?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Kami menyediakan platform pengaduan yang modern, aman, dan mudah digunakan untuk memastikan suara Anda didengar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-700 group hover:scale-105 transition-transform">
                <div className="mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-800" id="panduan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cara Kerja Sistem
            </h2>
            <p className="text-xl text-gray-300">
              Proses pengaduan yang sederhana dalam 4 langkah mudah
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Daftar/Login", desc: "Buat akun atau masuk ke sistem" },
              { step: "2", title: "Isi Formulir", desc: "Lengkapi data pengaduan Anda" },
              { step: "3", title: "Kirim Laporan", desc: "Submit pengaduan dengan dokumen pendukung" },
              { step: "4", title: "Pantau Progress", desc: "Lacak status penanganan secara real-time" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-800" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-gray-300">
              Temukan jawaban untuk pertanyaan umum tentang sistem pengaduan
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-900 rounded-lg shadow-sm border border-slate-700">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center transition-colors hover:cursor-pointer"
                >
                  <span className="font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Menyampaikan Pengaduan Anda?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Bergabunglah dengan ribuan warga yang telah merasakan kemudahan sistem pengaduan digital kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-200 px-8 py-4 text-lg font-semibold" onClick={() => router.push("/daftar")}>
              Buat Akun
            </Button>
            <Button size="lg" className="border-white hover:text-white px-8 py-4 text-lg" onClick={() => router.push("/masuk")}>
              Masuk
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">SiPengMas</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Sistem Pengaduan Masyarakat yang menghubungkan warga dengan pemerintah untuk menciptakan pelayanan publik yang lebih baik.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">0800-1234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">info@sipengmas.go.id</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Madiun, Indonesia</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="daftar" className="hover:text-white transition-colors">Pengaduan Online</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#panduan" className="hover:text-white transition-colors">Panduan</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 SiPengMas. Semua hak dilindungi undang-undang.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}