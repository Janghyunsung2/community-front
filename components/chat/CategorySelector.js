import { useEffect, useState } from "react";
import api from "@/utils/axios";

const CategorySelector = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error("카테고리 로딩 실패:", err);
        setError("카테고리를 불러오지 못했습니다.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="text-gray-500">카테고리를 불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">카테고리 선택</h2>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            className="p-3 rounded bg-gray-200 hover:bg-blue-500 hover:text-white"
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
