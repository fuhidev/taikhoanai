import { ApiService } from "./api";
import { ProductAccess, StoredUserData } from "./types";

class PopupManager {
 private loginForm: HTMLElement;
 private userDashboard: HTMLElement;
 private loading: HTMLElement;
 private alertContainer: HTMLElement;

 constructor() {
  this.loginForm = document.getElementById("loginForm")!;
  this.userDashboard = document.getElementById("userDashboard")!;
  this.loading = document.getElementById("loading")!;
  this.alertContainer = document.getElementById("alertContainer")!;

  this.initializeEventListeners();
  this.checkLoginStatus();
 }

 private initializeEventListeners(): void {
  // Login button
  document.getElementById("loginBtn")?.addEventListener("click", () => {
   this.handleLogin();
  });

  // Logout button
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
   this.handleLogout();
  });

  // Enter key for login
  document.getElementById("password")?.addEventListener("keypress", (e) => {
   if (e.key === "Enter") {
    this.handleLogin();
   }
  });
 }
 private async handleLogin(): Promise<void> {
  const phoneNumber = (
   document.getElementById("phoneNumber") as HTMLInputElement
  ).value.trim();
  const password = (
   document.getElementById("password") as HTMLInputElement
  ).value.trim();

  if (!phoneNumber || !password) {
   this.showAlert("Vui lòng nhập đầy đủ thông tin", "error");
   return;
  }

  this.showLoading(true);
  this.clearAlert();

  try {
   console.log("Attempting login...");
   const response = await ApiService.login({ phoneNumber, password });
   console.log("Login response:", response);
   if (response.success && response.user) {
    console.log("Login successful, getting product access...");

    // Store user data first
    const userData: StoredUserData = {
     user: response.user,
     subscriptions: response.subscriptions || [],
     productAccess: [], // Will be updated below
     loginTime: Date.now(),
    };

    try {
     // Get product access
     const productAccessResponse = await ApiService.getProductAccess(
      response.user.id
     );
     console.log("Product access response:", productAccessResponse);

     if (productAccessResponse.success && productAccessResponse.data) {
      userData.productAccess = productAccessResponse.data;
     }
    } catch (productError) {
     console.warn("Failed to fetch product access:", productError);
     // Continue with empty product access
    }

    // Store user data
    await chrome.storage.local.set({ userData });
    console.log("User data stored:", userData);

    // Show dashboard first
    this.showDashboard(userData);

    // Then show success message
    setTimeout(() => {
     this.showAlert("Đăng nhập thành công!", "success");
    }, 100);
   } else {
    console.log("Login failed:", response.message);
    this.showAlert(response.message || "Đăng nhập thất bại", "error");
   }
  } catch (error) {
   console.error("Login error:", error);
   this.showAlert("Có lỗi xảy ra khi đăng nhập", "error");
  } finally {
   this.showLoading(false);
  }
 }

 private async handleLogout(): Promise<void> {
  await chrome.storage.local.remove("userData");
  this.showLoginForm();
  this.clearAlert();
  this.clearLoginForm();
 }

 private async checkLoginStatus(): Promise<void> {
  try {
   const result = await chrome.storage.local.get("userData");
   if (result.userData) {
    const userData: StoredUserData = result.userData;

    // Check if login is still valid (24 hours)
    const loginAge = Date.now() - userData.loginTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (loginAge < maxAge) {
     this.showDashboard(userData);
    } else {
     // Login expired
     await this.handleLogout();
    }
   } else {
    this.showLoginForm();
   }
  } catch (error) {
   console.error("Check login status error:", error);
   this.showLoginForm();
  }
 }

 private showDashboard(userData: StoredUserData): void {
  this.loginForm.classList.add("hidden");
  this.userDashboard.classList.remove("hidden");

  // Update user info
  (document.getElementById("userPhone") as HTMLElement).textContent =
   userData.user.phoneNumber;
  (document.getElementById("loginTime") as HTMLElement).textContent = new Date(
   userData.loginTime
  ).toLocaleString("vi-VN");

  // Update product list
  this.updateProductList(userData.productAccess);
 }

 private showLoginForm(): void {
  this.userDashboard.classList.add("hidden");
  this.loginForm.classList.remove("hidden");
 }
 private showLoading(show: boolean): void {
  if (show) {
   this.loading.classList.remove("hidden");
   this.loginForm.classList.add("hidden");
   this.userDashboard.classList.add("hidden");
  } else {
   this.loading.classList.add("hidden");
   // Show appropriate form based on login status
   if (this.userDashboard.classList.contains("hidden")) {
    this.loginForm.classList.remove("hidden");
   } else {
    this.userDashboard.classList.remove("hidden");
   }
  }
 }

 private updateProductList(productAccess: ProductAccess[]): void {
  const productList = document.getElementById("productList")!;
  productList.innerHTML = "";

  if (productAccess.length === 0) {
   productList.innerHTML =
    '<p style="text-align: center; color: #666;">Bạn chưa có sản phẩm nào</p>';
   return;
  }

  productAccess.forEach((product) => {
   const productItem = document.createElement("div");
   productItem.className = "product-item";

   const endDate = new Date(product.endDate);
   const isExpired = endDate < new Date();
   const statusText = isExpired ? "Hết hạn" : "Còn hạn";
   const statusColor = isExpired ? "#dc3545" : "#28a745";

   productItem.innerHTML = `
        <div class="product-name">${product.productName}</div>
        <div class="product-status">
          Website: ${product.website}<br>
          Hết hạn: ${endDate.toLocaleDateString("vi-VN")}<br>
          <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
        </div>
      `;

   productList.appendChild(productItem);
  });
 }
 private showAlert(message: string, type: "success" | "error"): void {
  console.log(`Showing ${type} alert:`, message);
  this.alertContainer.innerHTML = `
      <div class="alert ${type}">
        ${message}
      </div>
    `;

  // Make sure alert is visible
  this.alertContainer.style.display = "block";

  // Auto-hide success messages after 3 seconds
  if (type === "success") {
   setTimeout(() => {
    this.clearAlert();
   }, 3000);
  }
 }
 private clearAlert(): void {
  console.log("Clearing alert");
  this.alertContainer.innerHTML = "";
  this.alertContainer.style.display = "none";
 }

 private clearLoginForm(): void {
  (document.getElementById("phoneNumber") as HTMLInputElement).value = "";
  (document.getElementById("password") as HTMLInputElement).value = "";
 }
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
 new PopupManager();
});
