import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const graphqlRequest = async (endpoint: string, query: string) => {
  const response = await api.post(endpoint, { query });
  return response.data.data;
};

export const productService = {
  getAll: () => graphqlRequest('/api/products/graphql/', 
    'query { products { id sku name category { id name slug } costPrice sellingPrice currentStock lowStockThreshold isActive createdAt updatedAt } }'
  ),
  create: (input: any) => graphqlRequest('/api/products/graphql/',
    `mutation { createProduct(input: { sku: "${input.sku}", name: "${input.name}", categoryId: ${input.categoryId}, costPrice: "${input.costPrice}", sellingPrice: "${input.sellingPrice}", currentStock: ${input.currentStock}, lowStockThreshold: ${input.lowStockThreshold} }) { id sku name category { name } costPrice sellingPrice currentStock } }`
  ),
  update: (id: number, input: any) => graphqlRequest('/api/products/graphql/',
    `mutation { updateProduct(id: ${id}, input: { name: "${input.name}", costPrice: "${input.costPrice}", sellingPrice: "${input.sellingPrice}", lowStockThreshold: ${input.lowStockThreshold} }) { id name costPrice sellingPrice } }`
  ),
  delete: (id: number) => graphqlRequest('/api/products/graphql/',
    `mutation { deleteProduct(id: ${id}) { success message } }`
  )
};

export const categoryService = {
  getAll: () => graphqlRequest('/api/products/graphql/',
    'query { categories { id name slug createdAt } }'
  ),
  create: (input: any) => graphqlRequest('/api/products/graphql/',
    `mutation { createCategory(input: { name: "${input.name}", slug: "${input.slug}" }) { id name slug createdAt } }`
  ),
  update: (id: number, input: any) => graphqlRequest('/api/products/graphql/',
    `mutation { updateCategory(id: ${id}, input: { name: "${input.name}", slug: "${input.slug}" }) { id name slug } }`
  ),
  delete: (id: number) => graphqlRequest('/api/products/graphql/',
    `mutation { deleteCategory(id: ${id}) { success message } }`
  )
};

export const inventoryService = {
  getTransactions: () => graphqlRequest('/api/inventory/graphql/',
    'query { inventoryTransactions { id product { name sku } qty type referenceType unitCost createdAt note } }'
  ),
  getStockLots: () => graphqlRequest('/api/inventory/graphql/',
    'query { stockLots { id product { name sku } qty unitCost remainingQty createdAt reference } }'
  ),
  createTransaction: (input: any) => graphqlRequest('/api/inventory/graphql/',
    `mutation { createInventoryTransaction(input: { productId: ${input.productId}, qty: ${input.qty}, type: "${input.type}", referenceType: "${input.referenceType}", unitCost: "${input.unitCost}", note: "${input.note}" }) { id product { name } qty type referenceType unitCost note } }`
  ),
  createStockLot: (input: any) => graphqlRequest('/api/inventory/graphql/',
    `mutation { createStockLot(input: { productId: ${input.productId}, qty: ${input.qty}, unitCost: "${input.unitCost}", reference: "${input.reference}" }) { id product { name } qty unitCost remainingQty reference } }`
  )
};

export const supplierService = {
  getAll: () => graphqlRequest('/api/suppliers/graphql/',
    'query { suppliers { id name code contactPerson phone email address isActive createdAt } }'
  ),
  create: (input: any) => graphqlRequest('/api/suppliers/graphql/',
    `mutation { createSupplier(input: { name: "${input.name}", code: "${input.code}", contactPerson: "${input.contactPerson}", phone: "${input.phone}", email: "${input.email}", address: "${input.address}" }) { id name code contactPerson phone email } }`
  ),
  update: (id: number, input: any) => graphqlRequest('/api/suppliers/graphql/',
    `mutation { updateSupplier(id: ${id}, input: { phone: "${input.phone}", email: "${input.email}" }) { id name phone email } }`
  )
};

export const purchaseService = {
  getAll: () => graphqlRequest('/api/purchases/graphql/',
    'query { purchases { id supplier { name code } invoiceNo totalAmount status createdAt items { id product { name sku } qty unitCost lineTotal } } }'
  ),
  create: (input: any) => {
    const items = input.items.map((i: any) => `{ productId: ${i.productId}, qty: ${i.qty}, unitCost: "${i.unitCost}" }`).join(', ');
    return graphqlRequest('/api/purchases/graphql/',
      `mutation { createPurchase(input: { supplierId: ${input.supplierId}, invoiceNo: "${input.invoiceNo}", items: [${items}] }) { id supplier { name } invoiceNo totalAmount items { product { name } qty unitCost lineTotal } } }`
    );
  },
  updateStatus: (id: number, status: string) => graphqlRequest('/api/purchases/graphql/',
    `mutation { updatePurchase(id: ${id}, input: { status: "${status}" }) { id status } }`
  )
};

export const salesService = {
  getAll: () => graphqlRequest('/api/sales/graphql/',
    'query { sales { id customerName totalAmount status createdAt items { id product { name sku } qty unitPrice lineTotal } } }'
  ),
  create: (input: any) => {
    const items = input.items.map((i: any) => `{ productId: ${i.productId}, qty: ${i.qty}, unitPrice: "${i.unitPrice}" }`).join(', ');
    return graphqlRequest('/api/sales/graphql/',
      `mutation { createSale(input: { customerName: "${input.customerName}", items: [${items}] }) { id customerName totalAmount items { product { name } qty unitPrice lineTotal } } }`
    );
  },
  updateStatus: (id: number, status: string) => graphqlRequest('/api/sales/graphql/',
    `mutation { updateSale(id: ${id}, input: { status: "${status}" }) { id status } }`
  )
};
