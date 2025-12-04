import React, { useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([
    { id: 1, name: "Product A", price: 100 },
    { id: 2, name: "Product B", price: 200 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({ name: "", price: "" });

  // Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update Item
  const handleSubmit = () => {
    if (editItem) {
      setItems(
        items.map((item) =>
          item.id === editItem.id ? { ...item, ...form } : item
        )
      );
    } else {
      setItems([
        ...items,
        { id: Date.now(), name: form.name, price: form.price },
      ]);
    }
    handleClose();
  };

  // Delete Item
  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Open Modal
  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(item || { name: "", price: "" });
    setShowModal(true);
  };

  // Close Modal
  const handleClose = () => {
    setEditItem(null);
    setForm({ name: "", price: "" });
    setShowModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>

      {/* Add Button */}
      <button
        onClick={() => handleOpen()}
        className="mb-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add New Item
      </button>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4">#ID</th>
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Price (₹)</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">₹{item.price}</td>
                <td className="py-3 px-4 flex gap-3">
                  <button
                    onClick={() => handleOpen(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">

            <h3 className="text-xl font-semibold mb-4">
              {editItem ? "Update Item" : "Add New Item"}
            </h3>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Enter price"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {editItem ? "Update" : "Add"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
