import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "../entities/employee.entity";
import { EmployeeFilters } from "../../common/interfaces/employee.interface";

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
  ) {}

  async findByFilters(filters: EmployeeFilters): Promise<[Employee[], number]> {
    const queryBuilder = this.repository.createQueryBuilder("employee");

    // Apply filters
    if (filters.department) {
      queryBuilder.andWhere(
        "LOWER(employee.department) LIKE LOWER(:department)",
        {
          department: `%${filters.department}%`,
        },
      );
    }

    if (filters.title) {
      queryBuilder.andWhere("LOWER(employee.title) LIKE LOWER(:title)", {
        title: `%${filters.title}%`,
      });
    }

    if (filters.location) {
      queryBuilder.andWhere("LOWER(employee.location) LIKE LOWER(:location)", {
        location: `%${filters.location}%`,
      });
    }

    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      queryBuilder.andWhere(
        "(LOWER(employee.firstName) LIKE LOWER(:search) OR LOWER(employee.lastName) LIKE LOWER(:search) OR LOWER(employee.email) LIKE LOWER(:search) OR LOWER(employee.phone) LIKE LOWER(:search))",
        { search: searchTerm },
      );
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    // Order by creation date (newest first)
    queryBuilder.orderBy("employee.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  async findOne(id: string): Promise<Employee | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(employeeData: Partial<Employee>): Promise<Employee> {
    const employee = this.repository.create(employeeData);
    return this.repository.save(employee);
  }

  async update(
    id: string,
    employeeData: Partial<Employee>,
  ): Promise<Employee | null> {
    await this.repository.update(id, employeeData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getDepartments(): Promise<string[]> {
    const result = await this.repository
      .createQueryBuilder("employee")
      .select("DISTINCT employee.department", "department")
      .orderBy("employee.department", "ASC")
      .getRawMany();

    return result.map((row: any) => row.department);
  }

  async getTitles(): Promise<string[]> {
    const result = await this.repository
      .createQueryBuilder("employee")
      .select("DISTINCT employee.title", "title")
      .orderBy("employee.title", "ASC")
      .getRawMany();

    return result.map((row: any) => row.title);
  }

  async getLocations(): Promise<string[]> {
    const result = await this.repository
      .createQueryBuilder("employee")
      .select("DISTINCT employee.location", "location")
      .orderBy("employee.location", "ASC")
      .getRawMany();

    return result.map((row: any) => row.location);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async seedEmployees(employees: Partial<Employee>[]): Promise<void> {
    await this.repository.save(employees);
  }
}
