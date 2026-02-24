import { NavLink } from 'react-router-dom';

export default function NotFound404() {
  return (
    <>
      <div className="container mt-5">
        <h1>404</h1>
        <h2>找不到這個頁面</h2>
        <p>
          抱歉，您正在尋找的頁面可能已被移除、名稱已更改，或者暫時無法使用。
        </p>
        <NavLink className="btn btn-primary" to="/">
          回到首頁
        </NavLink>
      </div>
    </>
  );
}
