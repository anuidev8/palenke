export default function Footer() {
  return (
    <footer className="bg-[#2D1B14] text-[#FFF8EA]/60 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h3 className="text-2xl font-bold font-syne text-[#FFF8EA] mb-2">Plataforma Palenke</h3>
          <p className="text-sm">Infraestructura digital para el Proceso de Comunidades Negras (PCN).</p>
        </div>
        <div className="flex space-x-6 text-sm">
          <span>&copy; {new Date().getFullYear()} MVP Propuesta</span>
          <span className="hidden md:inline">|</span>
          <span>Construida en Co-Diseño</span>
        </div>
      </div>
    </footer>
  );
}
