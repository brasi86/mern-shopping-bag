import { useSelector } from "react-redux";

export default function ProviderTheme({ children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[#1e1e1e] min-h-screen">
        {children}
      </div>
    </div>
  );
}
