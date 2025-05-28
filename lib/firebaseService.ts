import {
 AdminLoginRequest,
 AdminLoginResponse,
 LoginRequest,
 LoginResponse,
 Order,
 Product,
 ProductAccess,
 User,
 UserSubscription,
} from "@/types";
import {
 addDoc,
 collection,
 deleteDoc,
 doc,
 getDocs,
 orderBy,
 query,
 Timestamp,
 updateDoc,
 where,
} from "firebase/firestore";
import { db } from "./firebase";

// Users
export const createUser = async (
 phoneNumber: string,
 password: string
): Promise<string> => {
 const user: Omit<User, "id"> = {
  phoneNumber,
  password,
  createdAt: new Date(),
  updatedAt: new Date(),
 };

 const docRef = await addDoc(collection(db, "users"), {
  ...user,
  createdAt: Timestamp.fromDate(user.createdAt),
  updatedAt: Timestamp.fromDate(user.updatedAt),
 });

 return docRef.id;
};

export const getUserByPhoneNumber = async (
 phoneNumber: string
): Promise<User | null> => {
 const q = query(
  collection(db, "users"),
  where("phoneNumber", "==", phoneNumber)
 );
 const querySnapshot = await getDocs(q);

 if (querySnapshot.empty) return null;

 const doc = querySnapshot.docs[0];
 const data = doc.data();

 return {
  id: doc.id,
  phoneNumber: data.phoneNumber,
  password: data.password,
  isAdmin: data.isAdmin || false,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate(),
 };
};

export const getAllUsers = async (): Promise<User[]> => {
 const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
 const querySnapshot = await getDocs(q);

 return querySnapshot.docs.map((doc) => {
  const data = doc.data();
  return {
   id: doc.id,
   phoneNumber: data.phoneNumber,
   password: data.password,
   isAdmin: data.isAdmin || false,
   createdAt: data.createdAt.toDate(),
   updatedAt: data.updatedAt.toDate(),
  };
 });
};

// Products
export const createProduct = async (
 name: string,
 duration: number,
 cookie: string,
 website: string
): Promise<string> => {
 const product: Omit<Product, "id"> = {
  name,
  duration,
  cookie,
  website,
  createdAt: new Date(),
  updatedAt: new Date(),
 };

 const docRef = await addDoc(collection(db, "products"), {
  ...product,
  createdAt: Timestamp.fromDate(product.createdAt),
  updatedAt: Timestamp.fromDate(product.updatedAt),
 });

 return docRef.id;
};

export const getAllProducts = async (): Promise<Product[]> => {
 const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
 const querySnapshot = await getDocs(q);

 return querySnapshot.docs.map((doc) => {
  const data = doc.data();
  return {
   id: doc.id,
   name: data.name,
   duration: data.duration,
   cookie: data.cookie,
   website: data.website,
   createdAt: data.createdAt.toDate(),
   updatedAt: data.updatedAt.toDate(),
  };
 });
};

export const updateProduct = async (
 id: string,
 updates: Partial<Product>
): Promise<void> => {
 const docRef = doc(db, "products", id);
 const updateData: any = {
  ...updates,
  updatedAt: Timestamp.fromDate(new Date()),
 };

 if (updates.createdAt) {
  updateData.createdAt = Timestamp.fromDate(updates.createdAt);
 }

 await updateDoc(docRef, updateData);
};

export const deleteProduct = async (id: string): Promise<void> => {
 await deleteDoc(doc(db, "products", id));
};

// User Subscriptions
export const createUserSubscription = async (
 userId: string,
 productId: string,
 duration: number
): Promise<string> => {
 const startDate = new Date();
 const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

 const subscription: Omit<UserSubscription, "id"> = {
  userId,
  productId,
  startDate,
  endDate,
  isActive: true,
  createdAt: new Date(),
 };

 const docRef = await addDoc(collection(db, "userSubscriptions"), {
  ...subscription,
  startDate: Timestamp.fromDate(subscription.startDate),
  endDate: Timestamp.fromDate(subscription.endDate),
  createdAt: Timestamp.fromDate(subscription.createdAt),
 });

 return docRef.id;
};

export const getUserSubscriptions = async (
 userId: string
): Promise<UserSubscription[]> => {
 const q = query(
  collection(db, "userSubscriptions"),
  where("userId", "==", userId),
  orderBy("createdAt", "desc")
 );
 const querySnapshot = await getDocs(q);

 return querySnapshot.docs.map((doc) => {
  const data = doc.data();
  return {
   id: doc.id,
   userId: data.userId,
   productId: data.productId,
   startDate: data.startDate.toDate(),
   endDate: data.endDate.toDate(),
   isActive: data.isActive,
   createdAt: data.createdAt.toDate(),
  };
 });
};

export const getAllUserSubscriptions = async (): Promise<
 UserSubscription[]
> => {
 const q = query(
  collection(db, "userSubscriptions"),
  orderBy("createdAt", "desc")
 );
 const querySnapshot = await getDocs(q);

 return querySnapshot.docs.map((doc) => {
  const data = doc.data();
  return {
   id: doc.id,
   userId: data.userId,
   productId: data.productId,
   startDate: data.startDate.toDate(),
   endDate: data.endDate.toDate(),
   isActive: data.isActive,
   createdAt: data.createdAt.toDate(),
  };
 });
};

export const revokeUserSubscription = async (
 subscriptionId: string
): Promise<void> => {
 const docRef = doc(db, "userSubscriptions", subscriptionId);
 await updateDoc(docRef, {
  isActive: false,
  updatedAt: Timestamp.fromDate(new Date()),
 });
};

// Orders
export const createOrder = async (
 userId: string,
 productId: string,
 duration: number,
 totalAmount?: number
): Promise<string> => {
 const order: Omit<Order, "id"> = {
  userId,
  productId,
  duration,
  totalAmount,
  status: "pending",
  createdAt: new Date(),
 };

 const docRef = await addDoc(collection(db, "orders"), {
  ...order,
  createdAt: Timestamp.fromDate(order.createdAt),
 });

 return docRef.id;
};

export const getAllOrders = async (): Promise<Order[]> => {
 const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
 const querySnapshot = await getDocs(q);

 return querySnapshot.docs.map((doc) => {
  const data = doc.data();
  return {
   id: doc.id,
   userId: data.userId,
   productId: data.productId,
   duration: data.duration,
   totalAmount: data.totalAmount,
   status: data.status,
   createdAt: data.createdAt.toDate(),
  };
 });
};

export const updateOrderStatus = async (
 id: string,
 status: Order["status"]
): Promise<void> => {
 const docRef = doc(db, "orders", id);
 await updateDoc(docRef, { status });
};

export const deleteOrder = async (id: string): Promise<void> => {
 await deleteDoc(doc(db, "orders", id));
};

// Authentication for Extension
export const authenticateUser = async (
 request: LoginRequest
): Promise<LoginResponse> => {
 try {
  const user = await getUserByPhoneNumber(request.phoneNumber);

  if (!user || user.password !== request.password) {
   return {
    success: false,
    message: "Số điện thoại hoặc mật khẩu không chính xác",
   };
  }

  const subscriptions = await getUserSubscriptions(user.id);
  const activeSubscriptions = subscriptions.filter(
   (sub) => sub.isActive && sub.endDate > new Date()
  );

  return {
   success: true,
   user,
   subscriptions: activeSubscriptions,
  };
 } catch (error) {
  return {
   success: false,
   message: "Có lỗi xảy ra khi đăng nhập",
  };
 }
};

export const getUserProductAccess = async (
 userId: string
): Promise<ProductAccess[]> => {
 const subscriptions = await getUserSubscriptions(userId);
 const activeSubscriptions = subscriptions.filter(
  (sub) => sub.isActive && sub.endDate > new Date()
 );

 const products = await getAllProducts();

 return activeSubscriptions.map((sub) => {
  const product = products.find((p) => p.id === sub.productId);
  return {
   productId: sub.productId,
   productName: product?.name || "Unknown Product",
   website: product?.website || "",
   cookie: product?.cookie || "",
   isActive: true,
   endDate: sub.endDate,
  };
 });
};

// Admin Authentication
export const authenticateAdmin = async (
 request: AdminLoginRequest
): Promise<AdminLoginResponse> => {
 try {
  const user = await getUserByPhoneNumber(request.phoneNumber);

  if (!user || user.password !== request.password) {
   return {
    success: false,
    message: "Số điện thoại hoặc mật khẩu không chính xác",
   };
  }

  // Kiểm tra quyền admin
  if (!user.isAdmin) {
   return {
    success: false,
    message: "Bạn không có quyền truy cập hệ thống quản lý",
   };
  }

  return {
   success: true,
   user,
  };
 } catch (error) {
  return {
   success: false,
   message: "Có lỗi xảy ra khi đăng nhập",
  };
 }
};

// Cập nhật user với isAdmin
export const updateUserAdmin = async (
 id: string,
 isAdmin: boolean
): Promise<void> => {
 const docRef = doc(db, "users", id);
 await updateDoc(docRef, {
  isAdmin,
  updatedAt: Timestamp.fromDate(new Date()),
 });
};
