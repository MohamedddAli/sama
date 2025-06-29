import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/product/${id}`);
        setProduct(res.data);

        // Fetch related products
        const relatedRes = await axios.get(
          `http://localhost:5000/product/category/${res.data.category}`
        );
        setRelated(relatedRes.data.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  const discountedPrice = product.discount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  const handleOrder = async () => {
    try {
      await axios.post("http://localhost:5000/order", {
        productId: product._id,
        quantity: Number(quantity),
      });
      alert("✅ Order placed!");
    } catch (err) {
      console.error("❌ Failed to place order", err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-gray-50 text-black">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-10">
        {/* Product info */}
        <div className="flex flex-col md:flex-row gap-10 mb-12">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-96 object-cover rounded-lg shadow border border-black"
          />
          <div className="w-full">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            {product.discount > 0 ? (
              <div className="text-xl font-semibold text-red-600 mb-2">
                ${discountedPrice.toFixed(2)}
                <span className="text-gray-500 line-through text-lg ml-2">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-xl font-semibold text-sky-700 mb-2">
                ${product.price.toFixed(2)}
              </div>
            )}

            {/* Quantity Control */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex border rounded">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-white"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 text-center border-x text-black"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded"
                onClick={() => alert("🛒 Added to cart!")}
              >
                Add to Cart
              </button>
              <button
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded"
                onClick={handleOrder}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-sky-800">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl p-4 border shadow hover:shadow-lg hover:scale-105 transition-transform"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-full object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sky-700 font-bold mt-1">
                    $
                    {item.discount > 0
                      ? (
                          item.price -
                          item.price * (item.discount / 100)
                        ).toFixed(2)
                      : item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
