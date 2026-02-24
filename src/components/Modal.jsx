function CustomModal({
  toggleModal,
  handleInputChange,
  newProductData,
  isModalOpen,
  modalMode,
  handleUpdateProduct,
  uploadImage,
}) {
  return (
    isModalOpen && (
      <div className="custom-modal-overlay" onClick={toggleModal}>
        <div
          className="custom-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="custom-modal-header">
            <h5 id="productModalLabel" className="custom-modal-title">
              <span>{modalMode === 'add' ? '新增產品' : '編輯產品'}</span>
            </h5>
            <button className="close-x" onClick={toggleModal}>
              &times;
            </button>
          </div>
          <div className="custom-modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="mb-3">
                  <label className="form-label d-block">
                    <span>上傳圖片</span>
                    <input
                      name="imageUrl"
                      type="file"
                      className="form-control rounded-pill mt-1"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => uploadImage(e)}
                    />
                  </label>
                </div>
                <div className="mb-3">
                  <label className="form-label d-block">
                    <span>輸入圖片網址</span>
                    <input
                      name="imageUrl"
                      type="url"
                      className="form-control rounded-pill mt-1"
                      placeholder="請輸入圖片連結"
                      value={newProductData.imageUrl}
                      onChange={(e) => handleInputChange(e, 'product')}
                    />
                  </label>
                </div>

                {modalMode === 'add' ? (
                  <img src={newProductData.imageUrl} alt="" />
                ) : (
                  <img
                    src={newProductData.imageUrl}
                    alt={newProductData.title}
                  />
                )}
              </div>

              <div className="col-sm-8">
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-block">
                      <span>標題</span>
                      <input
                        name="title"
                        type="text"
                        className="form-control rounded-pill mt-1"
                        placeholder="請輸入標題"
                        value={newProductData.title}
                        onChange={(e) => handleInputChange(e, 'product')}
                      />
                    </label>
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-block">
                      <span>星級</span>
                      <select
                        name="star"
                        type="text"
                        className="form-select rounded-pill mt-1"
                        value={newProductData.star}
                        onChange={(e) => handleInputChange(e, 'product')}
                      >
                        <option value="">請選擇</option>

                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </label>
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-block">
                      <span>分類</span>
                      <input
                        name="category"
                        type="text"
                        className="form-control rounded-pill mt-1"
                        placeholder="請輸入分類"
                        value={newProductData.category}
                        onChange={(e) => handleInputChange(e, 'product')}
                      />
                    </label>
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-block">
                      <span>單位</span>
                      <input
                        name="unit"
                        type="text"
                        className="form-control rounded-pill mt-1"
                        placeholder="請輸入單位"
                        value={newProductData.unit}
                        onChange={(e) => handleInputChange(e, 'product')}
                      />
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-block">
                      <span>原價</span>
                      <input
                        name="origin_price"
                        type="number"
                        min="0"
                        className="form-control rounded-pill mt-1"
                        placeholder="請輸入原價"
                        value={newProductData.origin_price}
                        onChange={(e) => handleInputChange(e, 'product')}
                      />
                    </label>
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label d-block">
                      <span>售價</span>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        className="form-control rounded-pill mt-1"
                        placeholder="請輸入售價"
                        value={newProductData.price}
                        onChange={(e) => handleInputChange(e, 'product')}
                      />
                    </label>
                  </div>
                </div>
                <hr />

                <div className="mb-3">
                  <label className="form-label d-block">
                    <span>產品描述</span>
                    <textarea
                      name="description"
                      className="form-control rounded-4 mt-1"
                      placeholder="請輸入產品描述"
                      value={newProductData.description}
                      onChange={(e) => handleInputChange(e, 'product')}
                    ></textarea>
                  </label>
                </div>

                <div className="mb-3">
                  <label className="form-label d-block">
                    <span>說明內容</span>
                    <textarea
                      name="content"
                      className="form-control rounded-4 mt-1"
                      placeholder="請輸入說明內容"
                      value={newProductData.content}
                      onChange={(e) => handleInputChange(e, 'product')}
                    ></textarea>
                  </label>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input
                        name="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={newProductData.is_enabled}
                        onChange={(e) => handleInputChange(e, 'product')}
                      />
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill me-3"
              onClick={toggleModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary rounded-pill"
              onClick={handleUpdateProduct}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default CustomModal;
