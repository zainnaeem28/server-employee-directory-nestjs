import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("employees")
@Index(["department"])
@Index(["email"], { unique: true })
@Index(["firstName", "lastName"])
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100 })
  department: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 255 })
  location: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  customAvatar?: string | null;

  @Column({ type: "date" })
  hireDate: Date;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  salary: number;

  @Column({ length: 100, nullable: true })
  manager?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
