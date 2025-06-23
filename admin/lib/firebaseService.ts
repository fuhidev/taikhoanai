import {
 AdminLoginRequest,
 AdminLoginResponse,
 Advertisement,
 LoginRequest,
 LoginResponse,
 Order,
 Page,
 PaginatedResult,
 PaginationOptions,
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
 DocumentData,
 getDoc,
 getDocs,
 limit,
 orderBy,
 query,
 QueryDocumentSnapshot,
 startAfter,
 Timestamp,
 updateDoc,
 where,
 WhereFilterOp,
} from "firebase/firestore";
import { db } from "./firebase";

// Users
export const createUser = async (
 phoneNumber: string,
 password: string,
 fullName: string
): Promise<string> => {
 const user: Omit<User, "id"> = {
  phoneNumber,
  password,
  fullName,
  isAdmin: false,
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
  fullName: data.fullName || "",
  isAdmin: data.isAdmin || false,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate(),
 };
};

export const getUserById = async (userId: string): Promise<User | null> => {
 try {
  const userSnap = await getDocs(
   query(collection(db, "users"), where("__name__", "==", userId))
  );

  if (userSnap.empty) {
   return null;
  }

  const userData = userSnap.docs[0].data();
  return {
   id: userSnap.docs[0].id,
   phoneNumber: userData.phoneNumber,
   password: userData.password,
   fullName: userData.fullName || userData.name || "",
   isAdmin: userData.isAdmin || false,
   createdAt: userData.createdAt.toDate(),
   updatedAt: userData.updatedAt.toDate(),
  };
 } catch (error) {
  console.error("Error getting user by ID:", error);
  return null;
 }
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
   fullName: data.fullName || "",
   isAdmin: data.isAdmin || false,
   createdAt: data.createdAt.toDate(),
   updatedAt: data.updatedAt.toDate(),
  };
 });
};

export const updateUser = async (
 id: string,
 updates: Partial<
  Pick<User, "phoneNumber" | "password" | "fullName" | "isAdmin">
 >
): Promise<void> => {
 const docRef = doc(db, "users", id);
 const updateData = {
  ...updates,
  updatedAt: Timestamp.fromDate(new Date()),
 };

 await updateDoc(docRef, updateData);
};

// Products
export const createProduct = async ({
 product: updatedProduct,
}: {
 product: Omit<Product, "id" | "updatedAt" | "createdAt" | "soldCount">;
}): Promise<string> => {
 const product = {
  ...updatedProduct,
  soldCount: 0, // Khởi tạo số lượng đã bán
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
   ...data,
   createdAt: data.createdAt.toDate() as Date,
   updatedAt: data.updatedAt.toDate() as Date,
  } as Product;
 });
};

export const updateProduct = async (
 id: string,
 updates: Partial<Product>
): Promise<void> => {
 const docRef = doc(db, "products", id);
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

 // Không tăng soldCount ở đây, chỉ tăng khi đơn hàng hoàn thành
 return docRef.id;
};

export const updateOrderStatus = async (
 id: string,
 status: Order["status"]
): Promise<void> => {
 const docRef = doc(db, "orders", id);
 await updateDoc(docRef, { status });

 // Nếu chuyển sang completed thì tăng soldCount cho sản phẩm
 if (status === "completed") {
  // Lấy thông tin đơn hàng
  const orderSnap = await getDoc(docRef);
  if (orderSnap.exists()) {
   const orderData = orderSnap.data();
   const productId = orderData.productId;
   if (productId) {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
     soldCount: (orderData.soldCount || 0) + 1,
    });
   }
  }
 }
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
 } catch {
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
   cookies: product?.cookie || "",
   cookie: product?.cookie || "",
   localStorage: product?.localStorage || "",
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

  return { success: true, user };
 } catch {
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

 // Set custom claims trên Firebase Auth (chỉ chạy được ở môi trường server)
 //  try {
 //   const { admin } = await import("./firebaseAdmin");
 //   await admin.auth().setCustomUserClaims(id, { admin: !!isAdmin });
 //  } catch (error) {
 //   console.error("Lỗi khi set custom claims cho user:", error);
 //  }
};

// ============ SESSION MANAGEMENT FUNCTIONS ============

import { DeviceInfo, UserSession } from "../types";

// Generate unique ID for sessions
const generateId = (): string => {
 return (
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15)
 );
};

// Session Management Functions
export const createUserSession = async (
 userId: string,
 deviceInfo: DeviceInfo
): Promise<string> => {
 try {
  const sessionId = generateId();
  const now = Date.now();
  // Lấy thông tin user
  const userDoc = await getUserById(userId);
  const userInfo = userDoc
   ? {
      phoneNumber: userDoc.phoneNumber || "N/A",
      fullName: userDoc.fullName || "",
     }
   : undefined;

  const session: UserSession = {
   id: sessionId,
   userId,
   userInfo,
   deviceInfo,
   loginTime: now,
   lastActive: now,
   isActive: true,
  };

  await addDoc(collection(db, "userSessions"), {
   ...session,
   loginTime: Timestamp.fromMillis(session.loginTime),
   lastActive: Timestamp.fromMillis(session.lastActive),
  });

  console.log(
   `Created session ${sessionId} for user ${userId} on device ${deviceInfo.deviceName}`
  );
  return sessionId;
 } catch (error) {
  console.error("Error creating user session:", error);
  throw error;
 }
};
export const getUserActiveSessions = async (
 userId: string
): Promise<UserSession | null> => {
 try {
  const q = query(
   collection(db, "userSessions"),
   where("userId", "==", userId),
   where("isActive", "==", true)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
   return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
   id: doc.id,
   ...data,
   loginTime: data.loginTime?.toMillis() || 0,
   lastActive: data.lastActive?.toMillis() || 0,
   revokedAt: data.revokedAt?.toMillis(),
  } as UserSession;
 } catch (error) {
  console.error("Error getting user sessions:", error);
  return null;
 }
};

export const validateUserSession = async (
 sessionId: string,
 deviceId: string
): Promise<{ valid: boolean; message?: string }> => {
 try {
  const sessionDoc = await getDocs(
   query(collection(db, "userSessions"), where("id", "==", sessionId))
  );

  if (sessionDoc.empty) {
   return { valid: false, message: "Session không tồn tại" };
  }

  const sessionData = sessionDoc.docs[0].data();

  if (!sessionData.isActive) {
   return { valid: false, message: "Session đã bị vô hiệu hóa" };
  }

  if (sessionData.deviceInfo.deviceId !== deviceId) {
   return { valid: false, message: "Device không khớp" };
  }

  // Update last active time
  await updateDoc(sessionDoc.docs[0].ref, {
   lastActive: Timestamp.fromMillis(Date.now()),
  });

  return { valid: true };
 } catch (error) {
  console.error("Error validating session:", error);
  return { valid: false, message: "Lỗi server" };
 }
};

export const revokeSession = async (
 sessionId: string,
 revokedBy: string
): Promise<void> => {
 try {
  const sessionQuery = query(
   collection(db, "userSessions"),
   where("id", "==", sessionId)
  );
  const sessionDocs = await getDocs(sessionQuery);

  if (!sessionDocs.empty) {
   await updateDoc(sessionDocs.docs[0].ref, {
    isActive: false,
    revokedAt: Timestamp.fromMillis(Date.now()),
    revokedBy,
   });

   console.log(`Session ${sessionId} revoked by ${revokedBy}`);
  }
 } catch (error) {
  console.error("Error revoking session:", error);
  throw error;
 }
};

export const getAllActiveSessions = async (): Promise<UserSession[]> => {
 try {
  const q = query(
   collection(db, "userSessions"),
   where("isActive", "==", true),
   orderBy("lastActive", "desc")
  );
  const snapshot = await getDocs(q);

  const sessions = snapshot.docs.map((doc) => {
   const data = doc.data();
   return {
    id: doc.id,
    ...data,
    loginTime: data.loginTime?.toMillis() || 0,
    lastActive: data.lastActive?.toMillis() || 0,
    revokedAt: data.revokedAt?.toMillis(),
   } as UserSession;
  });

  // Lấy thông tin user cho các session chưa có userInfo
  const sessionsWithUserInfo = await Promise.all(
   sessions.map(async (session) => {
    if (!session.userInfo && session.userId) {
     try {
      const userDoc = await getUserById(session.userId);
      if (userDoc) {
       session.userInfo = {
        phoneNumber: userDoc.phoneNumber || "N/A",
        fullName: userDoc.fullName || "",
       };
      }
     } catch (error) {
      console.error(`Error fetching user info for ${session.userId}:`, error);
     }
    }
    return session;
   })
  );

  return sessionsWithUserInfo;
 } catch (error) {
  console.error("Error getting all active sessions:", error);
  return [];
 }
};

export const getAllSessions = async (
 limit: number = 100
): Promise<UserSession[]> => {
 try {
  const q = query(
   collection(db, "userSessions"),
   orderBy("lastActive", "desc")
  );
  const snapshot = await getDocs(q);

  const sessions = snapshot.docs.slice(0, limit).map((doc) => {
   const data = doc.data();
   return {
    id: doc.id,
    ...data,
    loginTime: data.loginTime?.toMillis() || 0,
    lastActive: data.lastActive?.toMillis() || 0,
    revokedAt: data.revokedAt?.toMillis(),
   } as UserSession;
  });
  // Lấy thông tin user cho các session chưa có userInfo
  const sessionsWithUserInfo = await Promise.all(
   sessions.map(async (session) => {
    if (!session.userInfo && session.userId) {
     try {
      const userDoc = await getUserById(session.userId);
      if (userDoc) {
       session.userInfo = {
        phoneNumber: userDoc.phoneNumber || "N/A",
        fullName: userDoc.fullName || "",
       };
      }
     } catch (error) {
      console.error(`Error fetching user info for ${session.userId}:`, error);
     }
    }
    return session;
   })
  );

  return sessionsWithUserInfo;
 } catch (error) {
  console.error("Error getting all sessions:", error);
  return [];
 }
};

// Pages
export const createPage = async ({
 page: updatedPage,
}: {
 page: Omit<Page, "id" | "updatedAt" | "createdAt">;
}): Promise<string> => {
 const page = {
  ...updatedPage,
  createdAt: new Date(),
  updatedAt: new Date(),
 };

 const docRef = await addDoc(collection(db, "pages"), {
  ...page,
  createdAt: Timestamp.fromDate(page.createdAt),
  updatedAt: Timestamp.fromDate(page.updatedAt),
 });

 return docRef.id;
};

export const getAllPages = async (): Promise<Page[]> => {
 try {
  const q = query(collection(db, "pages"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  const pages: Page[] = [];
  querySnapshot.forEach((doc) => {
   const data = doc.data();
   pages.push({
    id: doc.id,
    slug: data.slug,
    title: data.title,
    content: data.content,
    isPublished: data.isPublished || false,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
   });
  });

  return pages;
 } catch (error) {
  console.error("Error getting pages:", error);
  return [];
 }
};

export const getPageById = async (id: string): Promise<Page | null> => {
 try {
  const docRef = doc(db, "pages", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
   const data = docSnap.data();
   return {
    id: docSnap.id,
    slug: data.slug,
    title: data.title,
    content: data.content,
    isPublished: data.isPublished || false,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
   };
  } else {
   return null;
  }
 } catch (error) {
  console.error("Error getting page by id:", error);
  return null;
 }
};

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
 try {
  const q = query(collection(db, "pages"), where("slug", "==", slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
   return null;
  }

  const data = querySnapshot.docs[0].data();
  return {
   id: querySnapshot.docs[0].id,
   slug: data.slug,
   title: data.title,
   content: data.content,
   isPublished: data.isPublished || false,
   createdAt: data.createdAt.toDate(),
   updatedAt: data.updatedAt.toDate(),
  };
 } catch (error) {
  console.error("Error getting page by slug:", error);
  return null;
 }
};

export const updatePage = async (
 id: string,
 page: Partial<Omit<Page, "id" | "createdAt" | "updatedAt">>
): Promise<void> => {
 try {
  const docRef = doc(db, "pages", id);
  await updateDoc(docRef, {
   ...page,
   updatedAt: Timestamp.fromDate(new Date()),
  });
 } catch (error) {
  console.error("Error updating page:", error);
  throw error;
 }
};

export const deletePage = async (id: string): Promise<void> => {
 try {
  await deleteDoc(doc(db, "pages", id));
 } catch (error) {
  console.error("Error deleting page:", error);
  throw error;
 }
};

// Advertisements
export const createAdvertisement = async (
 name: string,
 imageUrl: string,
 priority: number = 0
): Promise<string> => {
 const advertisement: Omit<Advertisement, "id"> = {
  name,
  imageUrl,
  isActive: true,
  priority,
  createdAt: new Date(),
  updatedAt: new Date(),
 };

 const docRef = await addDoc(collection(db, "advertisements"), {
  ...advertisement,
  createdAt: Timestamp.fromDate(advertisement.createdAt),
  updatedAt: Timestamp.fromDate(advertisement.updatedAt),
 });

 return docRef.id;
};

export const getAdvertisements = async (): Promise<Advertisement[]> => {
 try {
  const q = query(
   collection(db, "advertisements"),
   orderBy("priority", "desc"),
   orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
   const data = doc.data();
   return {
    id: doc.id,
    name: data.name,
    imageUrl: data.imageUrl,
    isActive: data.isActive,
    priority: data.priority || 0,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
   };
  });
 } catch (error) {
  console.error("Error getting advertisements:", error);
  throw error;
 }
};

export const getActiveAdvertisements = async (): Promise<Advertisement[]> => {
 try {
  const q = query(
   collection(db, "advertisements"),
   where("isActive", "==", true),
   orderBy("priority", "desc"),
   orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
   const data = doc.data();
   return {
    id: doc.id,
    name: data.name,
    imageUrl: data.imageUrl,
    isActive: data.isActive,
    priority: data.priority || 0,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
   };
  });
 } catch (error) {
  console.error("Error getting active advertisements:", error);
  throw error;
 }
};

export const updateAdvertisement = async (
 id: string,
 updates: Partial<Omit<Advertisement, "id" | "createdAt">>
): Promise<void> => {
 try {
  const updateData = {
   ...updates,
   updatedAt: Timestamp.fromDate(new Date()),
  };
  await updateDoc(doc(db, "advertisements", id), updateData);
 } catch (error) {
  console.error("Error updating advertisement:", error);
  throw error;
 }
};

export const deleteAdvertisement = async (id: string): Promise<void> => {
 try {
  await deleteDoc(doc(db, "advertisements", id));
 } catch (error) {
  console.error("Error deleting advertisement:", error);
  throw error;
 }
};

// ============ PAGINATION FUNCTIONS ============

// Generic pagination function
export const getPaginatedData = async <T>(
 collectionName: string,
 options: PaginationOptions,
 whereConditions: Array<{
  field: string;
  operator: WhereFilterOp;
  value: unknown;
 }> = [],
 transformer: (doc: QueryDocumentSnapshot<DocumentData>) => T
): Promise<PaginatedResult<T>> => {
 const {
  page,
  limit: pageLimit,
  orderByField = "createdAt",
  orderDirection = "desc",
 } = options;

 try {
  // Get total count first
  let countQuery = query(collection(db, collectionName));
  whereConditions.forEach((condition) => {
   countQuery = query(
    countQuery,
    where(condition.field, condition.operator, condition.value)
   );
  });
  const countSnapshot = await getDocs(countQuery);
  const totalCount = countSnapshot.size;

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageLimit);
  const offset = (page - 1) * pageLimit;

  // Build data query
  let dataQuery = query(collection(db, collectionName));
  whereConditions.forEach((condition) => {
   dataQuery = query(
    dataQuery,
    where(condition.field, condition.operator, condition.value)
   );
  });
  dataQuery = query(dataQuery, orderBy(orderByField, orderDirection));

  // Apply pagination
  if (offset > 0) {
   // For pages after the first, we need to get the starting document
   const offsetQuery = query(dataQuery, limit(offset));
   const offsetSnapshot = await getDocs(offsetQuery);
   if (offsetSnapshot.docs.length > 0) {
    const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
    dataQuery = query(dataQuery, startAfter(lastDoc), limit(pageLimit));
   } else {
    // If offset is beyond available data, return empty result
    return {
     data: [],
     totalCount,
     currentPage: page,
     totalPages,
     hasNextPage: false,
     hasPrevPage: page > 1,
    };
   }
  } else {
   dataQuery = query(dataQuery, limit(pageLimit));
  }

  const dataSnapshot = await getDocs(dataQuery);
  const data = dataSnapshot.docs.map(transformer);

  return {
   data,
   totalCount,
   currentPage: page,
   totalPages,
   hasNextPage: page < totalPages,
   hasPrevPage: page > 1,
  };
 } catch (error) {
  console.error(`Error getting paginated data from ${collectionName}:`, error);
  throw error;
 }
};

// Paginated Users
export const getPaginatedUsers = async (
 options: PaginationOptions
): Promise<PaginatedResult<User>> => {
 return getPaginatedData("users", options, [], (doc) => {
  const data = doc.data();
  return {
   id: doc.id,
   phoneNumber: data.phoneNumber,
   password: data.password,
   fullName: data.fullName || "",
   isAdmin: data.isAdmin || false,
   createdAt: data.createdAt.toDate(),
   updatedAt: data.updatedAt.toDate(),
  };
 });
};

// Paginated Products
export const getPaginatedProducts = async (
 options: PaginationOptions
): Promise<PaginatedResult<Product>> => {
 return getPaginatedData("products", options, [], (doc) => {
  const data = doc.data();
  return {
   id: doc.id,
   ...data,
   createdAt: data.createdAt.toDate() as Date,
   updatedAt: data.updatedAt.toDate() as Date,
  } as Product;
 });
};

// Paginated Orders
export const getPaginatedOrders = async (
 options: PaginationOptions
): Promise<PaginatedResult<Order>> => {
 return getPaginatedData("orders", options, [], (doc) => {
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

// Paginated User Subscriptions
export const getPaginatedUserSubscriptions = async (
 options: PaginationOptions
): Promise<PaginatedResult<UserSubscription>> => {
 return getPaginatedData("userSubscriptions", options, [], (doc) => {
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

// Paginated Sessions
export const getPaginatedSessions = async (
 options: PaginationOptions,
 activeOnly: boolean = false
): Promise<PaginatedResult<UserSession>> => {
 const whereConditions = activeOnly
  ? [{ field: "isActive", operator: "==" as WhereFilterOp, value: true }]
  : [];

 const result = await getPaginatedData(
  "userSessions",
  { ...options, orderByField: "lastActive" },
  whereConditions,
  (doc) => {
   const data = doc.data();
   return {
    id: doc.id,
    ...data,
    loginTime: data.loginTime?.toMillis() || 0,
    lastActive: data.lastActive?.toMillis() || 0,
    revokedAt: data.revokedAt?.toMillis(),
   } as UserSession;
  }
 );

 // Fetch user info for sessions
 const sessionsWithUserInfo = await Promise.all(
  result.data.map(async (session: UserSession) => {
   if (!session.userInfo && session.userId) {
    try {
     const userDoc = await getUserById(session.userId);
     if (userDoc) {
      session.userInfo = {
       phoneNumber: userDoc.phoneNumber || "N/A",
       fullName: userDoc.fullName || "",
      };
     }
    } catch (error) {
     console.error(`Error fetching user info for ${session.userId}:`, error);
    }
   }
   return session;
  })
 );

 return { ...result, data: sessionsWithUserInfo };
};

// Paginated Pages
export const getPaginatedPages = async (
 options: PaginationOptions
): Promise<PaginatedResult<Page>> => {
 return getPaginatedData("pages", options, [], (doc) => {
  const data = doc.data();
  return {
   id: doc.id,
   slug: data.slug,
   title: data.title,
   content: data.content,
   isPublished: data.isPublished || false,
   createdAt: data.createdAt.toDate(),
   updatedAt: data.updatedAt.toDate(),
  };
 });
};

// Paginated Advertisements
export const getPaginatedAdvertisements = async (
 options: PaginationOptions
): Promise<PaginatedResult<Advertisement>> => {
 return getPaginatedData(
  "advertisements",
  { ...options, orderByField: "priority", orderDirection: "desc" },
  [],
  (doc) => {
   const data = doc.data();
   return {
    id: doc.id,
    name: data.name,
    imageUrl: data.imageUrl,
    isActive: data.isActive,
    priority: data.priority || 0,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
   };
  }
 );
};
