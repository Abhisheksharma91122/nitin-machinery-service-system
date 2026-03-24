export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Nitin Machinery</h3>
          <p className="text-sm">
            Professional machine repair and service management solutions. We fix your machines so you can focus on building.
          </p>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm flex flex-col">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="/service-request" className="hover:text-white transition-colors">Request Service</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: info@nitinmachinery.com</li>
            <li>Phone: +1 234 567 8900</li>
            <li>Address: 123 Tech Avenue, Industry City</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Nitin Machinery. All rights reserved.</p>
      </div>
    </footer>
  );
}
