import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, ArrowUpRight, ArrowDownRight, Menu, X, Sun, Moon, Filter } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, subDays } from 'date-fns';

// Mock data with extended information
const salesData = [
  { name: 'Jan', sales: 4000, orders: 150, forecast: 4200 },
  { name: 'Feb', sales: 3000, orders: 120, forecast: 3300 },
  { name: 'Mar', sales: 5000, orders: 180, forecast: 5200 },
  { name: 'Apr', sales: 4500, orders: 160, forecast: 4700 },
  { name: 'May', sales: 6000, orders: 200, forecast: 6300 },
  { name: 'Jun', sales: 5500, orders: 190, forecast: 5800 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Books', value: 20 },
  { name: 'Sports', value: 15 },
  { name: 'Others', value: 5 },
];

const topProducts = [
  { name: 'Nike Air Max', sales: 1200 },
  { name: 'Adidas Ultra Boost', sales: 980 },
  { name: 'Puma RS-X', sales: 850 },
  { name: 'New Balance 990', sales: 720 },
  { name: 'Under Armour Hovr', sales: 650 },
];

const customerDemographics = [
  { name: '18-24', value: 20 },
  { name: '25-34', value: 35 },
  { name: '35-44', value: 25 },
  { name: '45-54', value: 15 },
  { name: '55+', value: 5 },
];

const initialOrders = [
  { id: '#12345', product: 'Nike Air Max', amount: 129.99, status: 'Delivered', date: '2024-02-20' },
  { id: '#12346', product: 'Adidas Ultra Boost', amount: 159.99, status: 'Processing', date: '2024-02-19' },
  { id: '#12347', product: 'Puma RS-X', amount: 89.99, status: 'Shipped', date: '2024-02-18' },
  { id: '#12348', product: 'New Balance 990', amount: 174.99, status: 'Processing', date: '2024-02-17' },
  { id: '#12349', product: 'Under Armour Hovr', amount: 139.99, status: 'Delivered', date: '2024-02-16' },
  { id: '#12350', product: 'Reebok Classic', amount: 79.99, status: 'Shipped', date: '2024-02-15' },
  { id: '#12351', product: 'Nike Zoom', amount: 149.99, status: 'Processing', date: '2024-02-14' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface StatCardProps {
  title: string;
  value: string;
  icon: any;
  trend: 'up' | 'down';
  trendValue: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
      </div>
      <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trend === 'up' ? (
        <ArrowUpRight className="w-4 h-4 text-green-500" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ml-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trendValue}
      </span>
    </div>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([subDays(new Date(), 30), new Date()]);
  const [startDate, endDate] = dateRange;
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedOrders = [...orders].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setOrders(sortedOrders);
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' ? true : order.status === statusFilter
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-8">Dashboard</h2>
          <nav>
            {/* Add navigation items here */}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`lg:ml-64 transition-margin duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Dashboard</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-600" />}
            </button>
          </div>

          {/* Date Range Picker */}
          <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="bg-white dark:bg-gray-700 border rounded-md p-2"
            />
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value="$54,239"
              icon={DollarSign}
              trend="up"
              trendValue="+12.5% from last month"
            />
            <StatCard
              title="Total Orders"
              value="1,432"
              icon={ShoppingCart}
              trend="up"
              trendValue="+8.2% from last month"
            />
            <StatCard
              title="New Customers"
              value="892"
              icon={Users}
              trend="down"
              trendValue="-3.1% from last month"
            />
            <StatCard
              title="Conversion Rate"
              value="2.4%"
              icon={TrendingUp}
              trend="up"
              trendValue="+1.2% from last month"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Line Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Sales Trend & Forecast</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%" aspect={4/3}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" allowDataOverflow={true} />
                    <YAxis allowDataOverflow={true} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} name="Actual Sales" />
                    <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} name="Forecast" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products Bar Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Top Products</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%" aspect={4/3}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis allowDataOverflow={true} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Customer Demographics */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Customer Demographics</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%" aspect={4/3}>
                  <PieChart>
                    <Pie
                      data={customerDemographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerDemographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Growth Area Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Revenue Growth</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%" aspect={4/3}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" allowDataOverflow={true} />
                    <YAxis allowDataOverflow={true} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dark:text-white">Recent Orders</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                  </select>
                  <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                      <th className="pb-4 cursor-pointer" onClick={() => handleSort('id')}>Order ID</th>
                      <th className="pb-4 cursor-pointer" onClick={() => handleSort('product')}>Product</th>
                      <th className="pb-4 cursor-pointer" onClick={() => handleSort('amount')}>Amount</th>
                      <th className="pb-4 cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                        <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{order.product}</td>
                        <td className="py-4 text-sm text-gray-500 dark:text-gray-400">${order.amount}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;