import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../logo-viorclinic.png";
import ilustracion from '../ilustracion.png';
import ChatbotWidget from "../components/ChatbotWidget";
import { FaGithub, FaLinkedin, FaEnvelope, FaCalendarAlt, FaShieldAlt, FaClock, FaUsers, FaStethoscope, FaChartLine, FaBars, FaTimes, FaArrowRight, FaCheckCircle } from "react-icons/fa";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      title: "Agenda Inteligente",
      description: "Sistema automatizado que optimiza horarios y reduce cancelaciones con recordatorios inteligentes.",
      color: "from-sky-400 to-blue-400"
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Seguridad Avanzada",
      description: "Encriptación de nivel bancario y cumplimiento total de normativas de protección de datos médicos.",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Análisis en Tiempo Real",
      description: "Dashboard completo con métricas, reportes y insights para optimizar tu clínica.",
      color: "from-cyan-400 to-sky-400"
    }
  ];

  const stats = [
    { number: "10K+", label: "Citas Programadas", icon: <FaCalendarAlt /> },
    { number: "500+", label: "Especialistas", icon: <FaStethoscope /> },
    { number: "98%", label: "Satisfacción", icon: <FaCheckCircle /> },
    { number: "24/7", label: "Disponibilidad", icon: <FaClock /> }
  ];

  const steps = [
    {
      step: "01",
      title: "Regístrate",
      description: "Crea tu cuenta en minutos y configura tu clínica",
      icon: <FaUsers />
    },
    {
      step: "02",
      title: "Personaliza",
      description: "Adapta la plataforma a las necesidades de tu práctica médica",
      icon: <FaStethoscope />
    },
    {
      step: "03",
      title: "Gestiona",
      description: "Comienza a gestionar citas y pacientes de manera eficiente",
      icon: <FaCalendarAlt />
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header Moderno */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src={logo}
                  alt="ViorClinic Logo - Software de gestión médica"
                  className="h-10 sm:h-12 transition-transform group-hover:scale-105" />
                <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
                ViorClinic
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">Características</a>
              <a href="#about" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">Nosotros</a>
              <a href="#contact" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">Contacto</a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Iniciar sesión
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b shadow-lg">
              <nav className="flex flex-col p-4 space-y-4">
                <a href="#features" className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2">Características</a>
                <a href="#about" className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2">Nosotros</a>
                <a href="#contact" className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2">Contacto</a>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-center mt-4"
                >
                  Iniciar sesión
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section Mejorado */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-200 to-cyan-200 rounded-full opacity-20 blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200 to-sky-200 rounded-full opacity-20 blur-3xl transform -translate-x-32 translate-y-32"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-600 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                Plataforma líder en gestión médica
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-sky-900 to-blue-900 bg-clip-text text-transparent">
                  Tu puerta digital a
                </span>
                <br />
                <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  citas médicas inteligentes
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Revoluciona la gestión de tu clínica con tecnología de vanguardia.
                Citas rápidas, seguras y sin complicaciones para pacientes y profesionales.
              </p>

              {/* Features List */}
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {[
                  { icon: "🚀", text: "Reservas en 30 segundos" },
                  { icon: "🔒", text: "Encriptación nivel bancario" },
                  { icon: "📱", text: "App móvil disponible" },
                  { icon: "🎯", text: "99.9% tiempo actividad" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <span className="text-2xl group-hover:scale-110 transition-transform" aria-hidden="true">{item.icon}</span>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  to="/login"
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <span>Comenzar ahora</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative group">
                <img
                  src={ilustracion}
                  alt="Ilustración de sistema de gestión médica ViorClinic"
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:-rotate-1" />
                <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 to-blue-400 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span className="text-sm font-semibold text-gray-700">En línea</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sky-600">24/7</div>
                  <div className="text-xs text-gray-600">Disponible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-white text-xl">{stat.icon}</div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section Mejorado */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-100 to-cyan-100 text-sky-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✨ Características principales
            </div>
            <h3 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-sky-900 bg-clip-text text-transparent">
                ¿Por qué elegir
              </span>
              <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                ViorClinic?
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre las herramientas que están transformando la manera en que las clínicas gestionan sus operaciones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl from-sky-200 to-cyan-200"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-sky-600 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <button className="inline-flex items-center gap-2 text-sky-600 font-semibold group-hover:gap-3 transition-all">
                    Conocer más
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-sky-900 bg-clip-text text-transparent">
                Cómo funciona
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tres simples pasos para revolucionar tu clínica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative group">
                <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-8">
                    <FaArrowRight className="text-2xl text-sky-300" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Mejorado */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h3 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            ¿Listo para transformar
            <br className="hidden sm:block" />
            <span className="text-cyan-200">tu clínica?</span>
          </h3>

          <p className="text-xl mb-10 text-sky-100 max-w-2xl mx-auto leading-relaxed">
            Únete a cientos de profesionales que ya optimizaron su práctica médica con ViorClinic
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-3 bg-white text-sky-600 px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
            >
              <span>Acceder al sistema</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#contact"
              className="inline-flex items-center gap-3 border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300"
            >
              <span>Contactar soporte</span>
              <FaEnvelope />
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-16 border-t border-white/20">
            <div className="flex items-center gap-2 text-white/80">
              <FaCheckCircle className="text-green-400" aria-hidden="true" />
              <span className="text-sm">30 días gratis</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <FaCheckCircle className="text-green-400" aria-hidden="true" />
              <span className="text-sm">Sin compromiso</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <FaCheckCircle className="text-green-400" aria-hidden="true" />
              <span className="text-sm">Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Mejorado */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={logo} alt="ViorClinic Logo" className="h-10" />
                <h4 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                  ViorClinic
                </h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transformando la gestión médica con tecnología innovadora y segura.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/andrezoficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 hover:bg-sky-600 rounded-xl transition-colors"
                  aria-label="Visitar nuestro GitHub"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/andres-suarez-653a44142/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 hover:bg-sky-600 rounded-xl transition-colors"
                  aria-label="Visitar nuestro LinkedIn"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href="mailto:andres.suarez@example.com"
                  className="p-3 bg-gray-800 hover:bg-sky-600 rounded-xl transition-colors"
                  aria-label="Enviarnos un correo"
                >
                  <FaEnvelope size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-semibold mb-4 text-white">Enlaces rápidos</h5>
              <ul className="space-y-2 text-sm">
                {['Características', 'Precios', 'Soporte', 'Documentación'].map(item => (
                  <li key={item}>
                    <a href="#" className="hover:text-sky-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="font-semibold mb-4 text-white">Legal</h5>
              <ul className="space-y-2 text-sm">
                {['Términos de uso', 'Política de privacidad', 'Cookies', 'HIPAA'].map(item => (
                  <li key={item}>
                    <a href="#" className="hover:text-sky-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Developer */}
            <div>
              <h5 className="font-semibold mb-4 text-white">Desarrollado por</h5>
              <div className="p-4 bg-gray-800 rounded-xl">
                <div className="font-semibold text-sky-400">Andrés Suárez</div>
                <div className="text-sm text-gray-400">Full Stack Developer</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} ViorClinic — Todos los derechos reservados. Hecho con ❤️ en Colombia
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot flotante */}
      <ChatbotWidget />
    </div>
  );
}