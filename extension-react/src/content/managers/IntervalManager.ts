export class IntervalManager {
 private static intervals = new Map<string, number>();
 static set(name: string, callback: () => void, delay: number): void {
  // Clear existing interval if exists
  this.clear(name);

  const id = setInterval(callback, delay);
  this.intervals.set(name, id);
 }
 static clear(name: string): void {
  const id = this.intervals.get(name);
  if (id) {
   clearInterval(id);
   this.intervals.delete(name);
  }
 }
 static clearAll(): void {
  this.intervals.forEach((id, name) => {
   clearInterval(id);
  });
  this.intervals.clear();
 }

 static isActive(name: string): boolean {
  return this.intervals.has(name);
 }
}
