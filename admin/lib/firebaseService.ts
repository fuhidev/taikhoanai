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
 password: string,
 fullName?: string
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
 product: Omit<Product, "id" | "updatedAt" | "createdAt">;
}): Promise<string> => {
 const product = {
  ...updatedProduct,
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
): Promise<UserSession[]> => {
 try {
  const q = query(
   collection(db, "userSessions"),
   where("userId", "==", userId),
   where("isActive", "==", true)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
   const data = doc.data();
   return {
    id: doc.id,
    ...data,
    loginTime: data.loginTime?.toMillis() || 0,
    lastActive: data.lastActive?.toMillis() || 0,
    revokedAt: data.revokedAt?.toMillis(),
   } as UserSession;
  });
 } catch (error) {
  console.error("Error getting user sessions:", error);
  return [];
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

export const revokeUserSessions = async (
 userId: string,
 revokedBy: string
): Promise<void> => {
 try {
  const activeSessions = await getUserActiveSessions(userId);

  const updatePromises = activeSessions.map((session) => {
   const sessionQuery = query(
    collection(db, "userSessions"),
    where("id", "==", session.id)
   );
   return getDocs(sessionQuery).then((docs) => {
    if (!docs.empty) {
     return updateDoc(docs.docs[0].ref, {
      isActive: false,
      revokedAt: Timestamp.fromMillis(Date.now()),
      revokedBy,
     });
    }
   });
  });

  await Promise.all(updatePromises);
  console.log(
   `Revoked ${activeSessions.length} sessions for user ${userId} by ${revokedBy}`
  );
 } catch (error) {
  console.error("Error revoking user sessions:", error);
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
