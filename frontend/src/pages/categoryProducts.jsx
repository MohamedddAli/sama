import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

const categoryProducts = () => {
  const { categoryId } = useParams(); // category ID
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchByCategory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/product/category/${categoryId}` // Adjusted endpoint to match your backend
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch category products", err);
      }
    };

    fetchByCategory();
  }, [categoryId]);

  const getDiscountedPrice = (price, discount) => {
    return price - price * (discount / 100);
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-gray-50 text-black">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-sky-800 mb-8 text-center">
          Products in This Category
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-600">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const isDiscounted = product.discount > 0;
              const discountedPrice = getDiscountedPrice(
                product.price,
                product.discount
              );

              return (
                <Link to={`/product/${product._id}`} key={product._id}>
                  <div className="relative bg-white rounded-xl border border-gray-200 p-4 shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 group cursor-pointer">
                    {/* image + content */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h2 className="text-lg font-semibold mb-1">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description}
                    </p>

                    <div className="text-md font-bold text-sky-700">
                      {product.discount > 0 ? (
                        <>
                          <span className="line-through text-gray-500 mr-2">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-red-600">
                            $
                            {(
                              product.price -
                              product.price * (product.discount / 100)
                            ).toFixed(2)}
                          </span>
                          <span className="ml-2 text-sm text-red-500 font-medium">
                            ({product.discount}% OFF)
                          </span>
                        </>
                      ) : (
                        <>${product.price.toFixed(2)}</>
                      )}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 rounded-xl flex items-center justify-center transition duration-300">
                      <span className="text-black text-sm opacity-0 group-hover:opacity-100 transition">
                        Click to view details
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default categoryProducts;
