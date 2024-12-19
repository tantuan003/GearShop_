import Cart from '~/models/CartModel';
import Product from '~/models/ProductModel';
import mongoose from 'mongoose';


// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
    try {
        // Sử dụng req.body thay vì req.params
        const { userId, productId, quantity } = req.body;
  
        // Kiểm tra giỏ hàng của người dùng
        let cart = await Cart.findOne({ userId });
  
        if (cart) {
            // Nếu giỏ hàng đã tồn tại, kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
  
            if (itemIndex > -1) {
                // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm vào giỏ
                cart.items.push({ productId, quantity });
            }
        } else {
            // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng
            cart = new Cart({
                userId,
                items: [{ productId, quantity }],
            });
        }
  
        // Lưu giỏ hàng
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng' });
    }
  };
  


// Lấy thông tin giỏ hàng
export const getCart = async (req, res) => {
  try {
      const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');

      // Nếu không tìm thấy giỏ hàng, trả về mảng rỗng
      if (!cart) {
          return res.status(404).json({ message: 'Giỏ hàng không tồn tại', items: [] });
      }

      // Trả về giỏ hàng dưới dạng JSON
      res.json(cart);
  } catch (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
      res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error: err.message, items: [] });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
          return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
      }

      // Xóa sản phẩm khỏi giỏ hàng
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();

      res.status(200).json(cart);
  } catch (err) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', err);
      res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error: err.message });
  }
};
