import Navbar from './Navbar';

export default function Layout({ children, title }) {
  return (
    <>
      <Navbar />
      <main className="py-4">
        <div className="container">
          {title && <h1 className="h3 mb-4 fw-semibold text-dark">{title}</h1>}
          {children}
        </div>
      </main>
    </>
  );
}
