import "../styles/ServiceBanner.css";

const ServiceBanner = () => {
  return (
    <div className="service-banner">
      <div className="service-item">
        <i className="bi bi-truck icon"></i>
        <div>
          <p className="title">Envío a todo el Perú</p>
          <p className="desc">Llevamos tus libros hasta tu casa.</p>
        </div>
      </div>
      <div className="service-item">
        <i className="bi bi-stars icon"></i>
        <div>
          <p className="title">Promociones especiales</p>
          <p className="desc">Descuentos y beneficios pensados para ti.</p>
        </div>
      </div>
      <div className="service-item">
        <i className="bi bi-shield-check icon"></i>
        <div>
          <p className="title">Préstamos seguros</p>
          <p className="desc">Tus préstamos están 100% protegidos.</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceBanner;
