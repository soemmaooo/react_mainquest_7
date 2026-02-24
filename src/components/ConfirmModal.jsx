function ConfirmModal({
  setIsConfirmModalOpen,
  isConfirmModalOpen,
  deleteProduct,
  delProductId,
}) {
  return (
    isConfirmModalOpen && (
      <div className="custom-modal-overlay">
        <div className="confirm-modal">
          <p className="fs-5 mb-5">確定要刪除此產品？</p>
          <div>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill me-3"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              取消
            </button>
            <button
              type="button"
              className="btn bg-primary rounded-pill"
              onClick={() => deleteProduct(delProductId)}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    )
  );
}
export default ConfirmModal;
