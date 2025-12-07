import React from "react";
import { Link } from "react-router-dom";
import "./Styles.css";
import Header from "./Header";

function Services() {
  // Updated routes to match app routing (protected routes expect these paths)
  const servicesData = [
    {
      title: "Expense Tracking",
      description: "Easily track your expenses.",
      img: "https://static.sheetgo.com/wp-content/uploads/2023/09/blog-cover_finance-processes-and-templates.webp",
      route: "/add-expense"
    },
    {
      title: "Budget Planning",
      description: "Plan your budget based on expenses.",
      img: "https://www.shutterstock.com/image-vector/expense-tracker-icon-element-design-260nw-2641284149.jpg",
      route: "/budget-planning"
    }
  ];

  return (
    <div>
      <Header />
      <div className="page-container">
        <h2>Our Services</h2>
        <div className="services-grid">
          {servicesData.map((service, i) => (
            <Link
              key={i}
              to={service.route}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="service-card">
                <img
                  src={service.img}
                  alt={service.title}
                  className="service-icon"
                />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
