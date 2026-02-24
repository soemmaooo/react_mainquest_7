import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="home-banner">
        <h1 className="home-text">拾光餐桌</h1>
        <NavLink className="home-button" to="/products">
          Go
        </NavLink>
      </div>
    </>
  );
}
