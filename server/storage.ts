import { 
  User, InsertUser, 
  Service, InsertService, 
  Document, InsertDocument,
  Tutorial, InsertTutorial
} from '../shared/schema';
import { defaultServices } from '../client/src/data/services';
import { defaultDocuments } from '../client/src/data/documents';
import { defaultTutorials } from '../client/src/data/tutorials';

// Storage interface for all data operations
export interface IStorage {
  // User CRUD operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service CRUD operations
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Document CRUD operations
  getDocuments(): Promise<Document[]>;
  getDocumentsByCategory(category: string): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentBySlug(slug: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Tutorial CRUD operations
  getTutorials(): Promise<Tutorial[]>;
  getFeaturedTutorials(): Promise<Tutorial[]>;
  getTutorial(id: number): Promise<Tutorial | undefined>;
  getTutorialBySlug(slug: string): Promise<Tutorial | undefined>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  updateTutorial(id: number, tutorial: Partial<InsertTutorial>): Promise<Tutorial | undefined>;
  deleteTutorial(id: number): Promise<boolean>;
  searchContent(query: string): Promise<{
    services: Service[];
    documents: Document[];
    tutorials: Tutorial[];
  }>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private documents: Map<number, Document>;
  private tutorials: Map<number, Tutorial>;
  
  private currentUserId: number;
  private currentServiceId: number;
  private currentDocumentId: number;
  private currentTutorialId: number;
  
  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.documents = new Map();
    this.tutorials = new Map();
    
    this.currentUserId = 1;
    this.currentServiceId = 1;
    this.currentDocumentId = 1;
    this.currentTutorialId = 1;
    
    this.initializeData();
  }
  
  private initializeData() {
    // Add default admin user
    this.createUser({
      username: 'admin',
      password: 'admin123', // In a real app, this would be hashed
      email: 'admin@example.com',
      role: 'admin'
    });
    
    // Add default services
    defaultServices.forEach(service => {
      this.services.set(this.currentServiceId, {
        ...service,
        id: this.currentServiceId,
        createdAt: new Date()
      });
      this.currentServiceId++;
    });
    
    // Add default documents
    defaultDocuments.forEach(doc => {
      this.documents.set(this.currentDocumentId, {
        ...doc,
        id: this.currentDocumentId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      this.currentDocumentId++;
    });
    
    // Add default tutorials
    defaultTutorials.forEach(tutorial => {
      this.tutorials.set(this.currentTutorialId, {
        ...tutorial,
        id: this.currentTutorialId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      this.currentTutorialId++;
    });
  }
  
  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Service Methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const newService: Service = { ...service, id, createdAt: new Date() };
    this.services.set(id, newService);
    return newService;
  }
  
  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.services.get(id);
    if (!existingService) {
      return undefined;
    }
    
    const updatedService = { ...existingService, ...service };
    this.services.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }
  
  // Document Methods
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }
  
  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      doc => doc.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocumentBySlug(slug: string): Promise<Document | undefined> {
    return Array.from(this.documents.values()).find(
      doc => doc.slug === slug
    );
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const now = new Date();
    const newDocument: Document = { ...document, id, createdAt: now, updatedAt: now };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  
  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    const existingDocument = this.documents.get(id);
    if (!existingDocument) {
      return undefined;
    }
    
    const updatedDocument = { 
      ...existingDocument, 
      ...document, 
      updatedAt: new Date() 
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
  
  // Tutorial Methods
  async getTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values());
  }
  
  async getFeaturedTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values()).filter(
      tutorial => tutorial.featured === 1
    );
  }
  
  async getTutorial(id: number): Promise<Tutorial | undefined> {
    return this.tutorials.get(id);
  }
  
  async getTutorialBySlug(slug: string): Promise<Tutorial | undefined> {
    return Array.from(this.tutorials.values()).find(
      tutorial => tutorial.slug === slug
    );
  }
  
  async createTutorial(tutorial: InsertTutorial): Promise<Tutorial> {
    const id = this.currentTutorialId++;
    const now = new Date();
    const newTutorial: Tutorial = { 
      ...tutorial, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.tutorials.set(id, newTutorial);
    return newTutorial;
  }
  
  async updateTutorial(id: number, tutorial: Partial<InsertTutorial>): Promise<Tutorial | undefined> {
    const existingTutorial = this.tutorials.get(id);
    if (!existingTutorial) {
      return undefined;
    }
    
    const updatedTutorial = {
      ...existingTutorial,
      ...tutorial,
      updatedAt: new Date()
    };
    this.tutorials.set(id, updatedTutorial);
    return updatedTutorial;
  }
  
  async deleteTutorial(id: number): Promise<boolean> {
    return this.tutorials.delete(id);
  }
  
  // Search across all content
  async searchContent(query: string): Promise<{
    services: Service[];
    documents: Document[];
    tutorials: Tutorial[];
  }> {
    const lowerCaseQuery = query.toLowerCase();
    
    const services = Array.from(this.services.values()).filter(service => 
      service.name.toLowerCase().includes(lowerCaseQuery) || 
      service.description.toLowerCase().includes(lowerCaseQuery)
    );
    
    const documents = Array.from(this.documents.values()).filter(doc => 
      doc.title.toLowerCase().includes(lowerCaseQuery) || 
      doc.content.toLowerCase().includes(lowerCaseQuery)
    );
    
    const tutorials = Array.from(this.tutorials.values()).filter(tutorial => 
      tutorial.title.toLowerCase().includes(lowerCaseQuery) || 
      tutorial.description.toLowerCase().includes(lowerCaseQuery) || 
      tutorial.content.toLowerCase().includes(lowerCaseQuery)
    );
    
    return { services, documents, tutorials };
  }
}

// Create and export storage instance
export const storage = new MemStorage();