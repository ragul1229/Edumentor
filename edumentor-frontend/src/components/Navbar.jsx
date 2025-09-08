function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">EduMentor 🚀</h1>
      <ul className="flex gap-6">
        <li><a href="/" className="hover:underline">Home</a></li>
        <li><a href="/login" className="hover:underline">Login</a></li>
        <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
