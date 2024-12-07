import { useEffect, useState, useRef, useTransition } from "react";
import { getAllProducts } from "../../services/getAllProducts";
import ProductList from "../../components/ProductList/ProductList";
import Navbar from "../../components/Navbar/Navbar";
import RadioButton from "../../components/RadioButton/RadioButton";
import getAllProductCategories from "../../services/getAllProductCategories";

function Products() {
  const [products, setProducts] = useState([]);
  const RadioButtonOpts = useRef([
    {
      label: "All",
      value: "all",
    },
  ]);

  const originalProducts = useRef([]);
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      let allProducts = await getAllProducts();
      allProducts = allProducts.length > 0 ? allProducts : [];
      originalProducts.current = allProducts;
      setProducts(allProducts);
    }

    async function fetchCategories() {
      const allCategories = await getAllProductCategories();
      const newCategories = allCategories
        .map((cat) => ({ label: cat.name, value: cat.slug }))
        .filter(
          (newCat) =>
            !RadioButtonOpts.current.some(
              (existingCat) => existingCat.value === newCat.value
            )
        );
      RadioButtonOpts.current = [...RadioButtonOpts.current, ...newCategories];
    }

    fetchCategories();
    fetchProducts();
    // console.log(originalProducts);
  }, []);

  useEffect(() => {
    startTransition(() => {
      const filtered = originalProducts.current.filter((product) => {
        const matchedCategory =
          selectedCategory === "all" ||
          product.category_slug === selectedCategory;
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchedCategory && matchesSearch;
      });
      setProducts(filtered);
    });
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };
  // const RadioButtonOpts = [

  //     {
  //       label: 'All',
  //       value: 'all'
  //     },
  //     {
  //       label: 'Men\'s Shoes',
  //       value: 'menshoes'
  //     },
  //     {
  //       label: 'Women\'s Shoes',
  //       value: 'womenshoes'
  //     },

  // ]
  return (
    <>
      <Navbar onSearchChange={handleSearchChange} />

      <div className="px-24 py-4 gap-4 mt-4 flex-wrap">
        <h3 className="font-medium">Filter</h3>
        <div className="flex gap-2 flex-wrap">
          <RadioButton
            options={RadioButtonOpts.current}
            defaultValue={"all"}
            onChange={handleCategoryChange}
          />
        </div>
      </div>

      <section className="container px-24 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 mx-auto">
          <ProductList products={products} isPending={isPending} />
        </div>
      </section>
    </>
  );
}
export default Products;
