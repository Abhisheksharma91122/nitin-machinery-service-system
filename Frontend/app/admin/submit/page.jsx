"use client"

export default function Submit() {
    const handleSubmit = () => {
        alert("submit")
    }
  return (
    <div className="h-screen">
      <div className="flex items-center justify-center h-full">
        <div className="bg-slate-400 p-12 rounded-md">
        <div className="text-center mb-4 text-2xl text-blue-700">Login</div>
        <form action={handleSubmit}>
          <div>
            <label className="block mb-2" for="username">Username</label>
            <input className="rounded-md p-2" id="username" type="text" placeholder="admin" />
          </div>
          <div className="mt-4">
            <label className="block mb-2" for="password">Password</label>
            <input className="rounded-md p-2" id="password" type="password" placeholder="....." />
          </div>
          <button className="bg-white rounded-md p-2 text-blue-700 border-l text-center mt-6" type="submit">Submit</button>
        </form>
        </div>
      </div>
    </div>
  );
}
