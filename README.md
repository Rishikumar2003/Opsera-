# Multi-Category Retail Inventory & Billing System

A browser-based application for small to medium retail businesses that allows for interactive billing, inventory management, and performance insights across multiple product categories.

## Features

### Homepage
- Store name/logo with welcome message
- Quick navigation links to Billing, Inventory, and Insights
- Overview of total stock items and product categories

### Categories Module
- Add, edit, or delete product categories
- Filter inventory and billing views by category

### Billing Page
- Select products by category
- Calculate subtotal, tax, and total payable
- Generate printable invoices
- Auto-update inventory after checkout

### Inventory Management
- Add, edit, and delete products
- View full inventory with search and filter options
- Alerts for low stock items

### Insights & Reports
- View sales data by category, product, and date range
- Identify best-selling and low-stock items
- Visual reports with charts for sales and stock trends

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or download the source code

2. Navigate to the project directory
   ```
   cd retail-inventory-system
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Start the development server
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:1234`

## Usage

### Setting Up Categories

Before adding products, you need to set up categories:

1. Navigate to the Categories page
2. Add categories like Grocery, Electronics, Clothing, etc.

### Adding Products

After setting up categories, you can add products:

1. Navigate to the Inventory page
2. Click "Add New Product"
3. Fill in the product details including name, category, price, and quantity

### Creating a Sale

1. Navigate to the Billing page
2. Select products from the left panel
3. Adjust quantities as needed
4. Add optional customer information
5. Click "Checkout" to complete the sale
6. Print the invoice if needed

### Viewing Reports

1. Navigate to the Insights page
2. Select the desired date range and category filter
3. View sales trends, top-selling products, and other analytics

## Data Storage

This application uses browser localStorage for data persistence. In a production environment, you would want to replace this with a proper database.

## Building for Production

To create a production build:

```
npm run build
```

The build files will be located in the `dist` directory.

## License

This project is licensed under the ISC License.