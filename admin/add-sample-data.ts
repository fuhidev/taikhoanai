// Script to add sample data to Firebase for testing
import { doc, setDoc } from "firebase/firestore";
import { db } from "./lib/firebase";

const sampleData = {
 // Sample users
 users: [
  {
   id: "user1",
   phoneNumber: "0123456789",
   password: "123456", // In real app, this should be hashed
   fullName: "Nguyễn Văn A",
   email: "nguyenvana@email.com",
   role: "user",
   isActive: true,
   createdAt: new Date(),
   updatedAt: new Date(),
  },
  {
   id: "user2",
   phoneNumber: "0987654321",
   password: "123456",
   fullName: "Trần Thị B",
   email: "tranthib@email.com",
   role: "user",
   isActive: true,
   createdAt: new Date(),
   updatedAt: new Date(),
  },
 ],

 // Sample products
 products: [
  {
   id: "prod1",
   name: "ChatGPT Plus",
   description: "ChatGPT Plus access for 1 month",
   website: "https://chat.openai.com",
   price: 500000,
   duration: 30,
   isActive: true,
   createdAt: new Date(),
   updatedAt: new Date(),
  },
  {
   id: "prod2",
   name: "Google Gemini Pro",
   description: "Google Gemini Pro access for 1 month",
   website: "https://gemini.google.com",
   price: 400000,
   duration: 30,
   isActive: true,
   createdAt: new Date(),
   updatedAt: new Date(),
  },
  {
   id: "prod3",
   name: "Leonardo AI",
   description: "Leonardo AI Pro access for 1 month",
   website: "https://app.leonardo.ai",
   price: 300000,
   duration: 30,
   isActive: true,
   createdAt: new Date(),
   updatedAt: new Date(),
  },
 ],

 // Sample product access
 productAccess: [
  {
   id: "access1",
   userId: "user1",
   productId: "prod1",
   productName: "ChatGPT Plus",
   website: "https://chat.openai.com",
   cookies:
    "__Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..sample_token_here; _dd_s=rum=1&id=sample_id&created=sample_created&expire=sample_expire",
   startDate: new Date(),
   endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
   isActive: true,
  },
  {
   id: "access2",
   userId: "user1",
   productId: "prod2",
   productName: "Google Gemini Pro",
   website: "https://gemini.google.com",
   cookies:
    "__Secure-1PSID=sample_google_session_id; __Secure-1PSIDTS=sample_timestamp; __Secure-1PSIDCC=sample_cc_token",
   startDate: new Date(),
   endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
   isActive: true,
  },
  {
   id: "access3",
   userId: "user2",
   productId: "prod3",
   productName: "Leonardo AI",
   website: "https://app.leonardo.ai",
   cookies:
    "leonardo_session=sample_leonardo_session; auth_token=sample_auth_token; user_tier=pro",
   startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Started 10 days ago
   endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
   isActive: true,
  },
 ],

 // Sample subscriptions
 subscriptions: [
  {
   id: "sub1",
   userId: "user1",
   productId: "prod1",
   startDate: new Date(),
   endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
   status: "active",
   autoRenew: true,
  },
  {
   id: "sub2",
   userId: "user1",
   productId: "prod2",
   startDate: new Date(),
   endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
   status: "active",
   autoRenew: false,
  },
  {
   id: "sub3",
   userId: "user2",
   productId: "prod3",
   startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
   endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
   status: "active",
   autoRenew: true,
  },
 ],

 // Sample orders
 orders: [
  {
   id: "order1",
   userId: "user1",
   productId: "prod1",
   productName: "ChatGPT Plus",
   quantity: 1,
   price: 500000,
   totalAmount: 500000,
   status: "completed",
   paymentMethod: "bank_transfer",
   createdAt: new Date(),
   updatedAt: new Date(),
  },
  {
   id: "order2",
   userId: "user1",
   productId: "prod2",
   productName: "Google Gemini Pro",
   quantity: 1,
   price: 400000,
   totalAmount: 400000,
   status: "completed",
   paymentMethod: "momo",
   createdAt: new Date(),
   updatedAt: new Date(),
  },
  {
   id: "order3",
   userId: "user2",
   productId: "prod3",
   productName: "Leonardo AI",
   quantity: 1,
   price: 300000,
   totalAmount: 300000,
   status: "completed",
   paymentMethod: "bank_transfer",
   createdAt: new Date(),
   updatedAt: new Date(),
  },
 ],
};

async function addSampleData() {
 try {
  // Adding sample data to Firebase...

  // Add users
  for (const user of sampleData.users) {
   await setDoc(doc(db, "users", user.id), user);
   // Added user: ${user.fullName}
  }

  // Add products
  for (const product of sampleData.products) {
   await setDoc(doc(db, "products", product.id), product);
   // Added product: ${product.name}
  }

  // Add product access
  for (const access of sampleData.productAccess) {
   await setDoc(doc(db, "productAccess", access.id), access);
   // Added product access: ${access.productName} for user ${access.userId}
  }

  // Add subscriptions
  for (const subscription of sampleData.subscriptions) {
   await setDoc(doc(db, "subscriptions", subscription.id), subscription);
   // Added subscription: ${subscription.id}
  }

  // Add orders
  for (const order of sampleData.orders) {
   await setDoc(doc(db, "orders", order.id), order);
   // Added order: ${order.productName}
  }

  // ✅ Sample data added successfully!
  // 📋 Test Accounts:
  // User 1: 0123456789 / 123456
  // User 2: 0987654321 / 123456
 } catch (error) {
  // ❌ Error adding sample data: ${error}
 }
}

// Export for use in other files
export { addSampleData, sampleData };
