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

    // Apply filters to the employee query
    // Each filter narrows down the results based on user input
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

    // Custom search logic for first and last name
    // - First word: matches firstName
    // - Second word (if present): matches lastName
    // This allows progressive search as the user types
    if (filters.search) {
      // Replace + with space, trim, and normalize whitespace
      let normalizedSearch = filters.search.replace(/\+/g, ' ');
      normalizedSearch = normalizedSearch.trim().replace(/\s+/g, ' ');
      console.log('Original search term:', filters.search);
      console.log('Normalized search term:', normalizedSearch);

      const words = normalizedSearch.toLowerCase().split(' ');
      console.log('Split words:', words);
      
        // First word: search in first names
  if (words.length > 0) {
    console.log('Searching for firstName containing:', words[0]);
    queryBuilder.andWhere(
      `LOWER(employee.firstName) LIKE :searchFirstName`,
      { searchFirstName: `%${words[0]}%` }
    );
  }
  
  // Second word (if present): filter by last name
  if (words.length > 1) {
    console.log('Filtering by lastName containing:', words[1]);
    queryBuilder.andWhere(
      `LOWER(employee.lastName) LIKE :searchLastName`,
      { searchLastName: `%${words[1]}%` }
    );
  }
    }

    // Pagination logic: calculates skip and limit for the query
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
