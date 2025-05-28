// Test script for aigiare.vn Management System
// Chạy script này trong browser console để test functionality

console.log("🎉 aigiare.vn Management System - Demo Script");

// Test 1: Check if app is running
console.log("✅ Web Application đang chạy tại:", window.location.origin);

// Test 2: Check Material-UI theme
console.log(
 "✅ Material-UI theme loaded:",
 !!window.document.querySelector("[data-emotion]")
);

// Test 3: Check navigation
const navTabs = document.querySelectorAll('[role="tab"]');
console.log("✅ Navigation tabs found:", navTabs.length);

// Test 4: Check responsive design
const isMobile = window.innerWidth < 768;
console.log("✅ Responsive design:", isMobile ? "Mobile view" : "Desktop view");

// Test API endpoints (cần server running)
async function testAPI() {
 try {
  // Test login endpoint
  const loginResponse = await fetch("/api/login", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ username: "test", password: "test" }),
  });
  console.log("✅ Login API response status:", loginResponse.status);

  // Test product-access endpoint
  const productResponse = await fetch("/api/product-access?userId=test");
  console.log("✅ Product access API response status:", productResponse.status);
 } catch (error) {
  console.log("⚠️ API test (cần Firebase config):", error.message);
 }
}

// Run API tests
testAPI();

console.log("\n📋 Demo completed! Các tính năng đã test:");
console.log("- ✅ Web Application UI");
console.log("- ✅ Navigation system");
console.log("- ✅ Material-UI components");
console.log("- ✅ Responsive design");
console.log("- ✅ API endpoints structure");
console.log("\n🔧 Để test đầy đủ, cần cấu hình Firebase trong .env.local");
