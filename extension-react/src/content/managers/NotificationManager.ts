import { NotificationType } from "../types";

export class NotificationManager {
 private static activeNotifications = new Set<HTMLElement>();
 private static styleInjected = false;

 static show(message: string, type: NotificationType): void {
  // Prevent duplicates
  if (this.isDuplicate(message)) return;

  this.injectStylesOnce();

  const notification = this.createNotification(message, type);
  document.body.appendChild(notification);
  this.activeNotifications.add(notification);

  // Animate in
  requestAnimationFrame(() => {
   notification.classList.add("show");
  });

  // Auto remove
  setTimeout(() => this.remove(notification), 5000);
 }

 private static isDuplicate(message: string): boolean {
  return Array.from(this.activeNotifications).some(
   (n) => n.textContent === message
  );
 }

 private static createNotification(
  message: string,
  type: NotificationType
 ): HTMLElement {
  const notification = document.createElement("div");
  notification.className = `ai-notification ai-notification-${type}`;
  notification.textContent = message;
  return notification;
 }

 private static injectStylesOnce(): void {
  if (this.styleInjected) return;

  const style = document.createElement("style");
  style.textContent = `
      .ai-notification {
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        padding: 12px 20px; border-radius: 8px; color: white;
        font-family: Arial, sans-serif; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); max-width: 300px;
        transform: translateX(100%); opacity: 0;
        transition: all 0.3s ease-out;
      }
      .ai-notification.show { transform: translateX(0); opacity: 1; }
      .ai-notification-success { background: rgba(76, 175, 80, 0.9); }
      .ai-notification-error { background: rgba(244, 67, 54, 0.9); }
      .ai-notification-warning { background: rgba(255, 152, 0, 0.9); }
    `;

  document.head.appendChild(style);
  this.styleInjected = true;
 }

 private static remove(notification: HTMLElement): void {
  notification.classList.remove("show");
  setTimeout(() => {
   if (notification.parentNode) {
    notification.remove();
    this.activeNotifications.delete(notification);
   }
  }, 300);
 }
}
