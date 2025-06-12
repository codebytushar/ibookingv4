// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="text-center text-sm text-white py-8 bg-indigo-600/90 backdrop-blur-md">
      © {new Date().getFullYear()} Golokdham IBooking. All rights reserved.
    </footer>
  );
}