import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Employee } from "./entities/employee.entity";
import { EmployeesRepository } from "./repositories/employees.repository";
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
  PaginatedEmployees,
} from "../common/interfaces/employee.interface";

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);
  private readonly randomUserApiUrl: string;

  constructor(
    private configService: ConfigService,
    private readonly employeesRepository: EmployeesRepository,
  ) {
    this.randomUserApiUrl = this.configService.get<string>(
      "RANDOM_USER_API_URL",
      "https://randomuser.me/api",
    );
    this.initializeEmployees();
  }

  private async initializeEmployees(): Promise<void> {
    try {
      // Check if we already have employees in the database
      const count = await this.employeesRepository.count();
      if (count > 0) {
        this.logger.log(
          `Database already contains ${count} employees, skipping initialization`,
        );
        return;
      }

      this.logger.log("Initializing employees from Random User API...");
      const response = await axios.get(
        `${this.randomUserApiUrl}?results=50&nat=us,gb,ca,au`,
      );
      const users = response.data.results;

      const employees = users.map((user: any) => ({
        firstName: user.name.first,
        lastName: user.name.last,
        email: user.email,
        phone: user.phone,
        department: this.getRandomDepartment(),
        title: this.getRandomTitle(),
        location: `${user.location.city}, ${user.location.country}`,
        avatar: user.picture.large,
        hireDate: this.getRandomHireDate(),
        salary: this.getRandomSalary(),
        manager: Math.random() > 0.7 ? this.getRandomManager() : undefined,
        isActive: true,
      }));

      await this.employeesRepository.seedEmployees(employees);
      this.logger.log(`Successfully initialized ${employees.length} employees`);
    } catch (error) {
      this.logger.error(
        "Failed to initialize employees from Random User API:",
        error,
      );
      throw error;
    }
  }

  private getRandomDepartment(): string {
    const departments = [
      "Engineering",
      "Marketing",
      "Sales",
      "HR",
      "Finance",
      "Operations",
      "Design",
      "Product",
    ];
    return departments[Math.floor(Math.random() * departments.length)];
  }

  private getRandomTitle(): string {
    const titles = [
      "Software Engineer",
      "Marketing Manager",
      "Sales Representative",
      "HR Specialist",
      "Financial Analyst",
      "Operations Manager",
      "UI/UX Designer",
      "Product Manager",
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private getRandomHireDate(): string {
    const start = new Date(2015, 0, 1);
    const end = new Date();
    const randomDate = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
    return randomDate.toISOString().split("T")[0];
  }

  private getRandomSalary(): number {
    return Math.floor(Math.random() * (150000 - 40000) + 40000);
  }

  private getRandomManager(): string {
    const managers = [
      "John Smith",
      "Sarah Johnson",
      "Michael Brown",
      "Emily Davis",
      "David Wilson",
    ];
    return managers[Math.floor(Math.random() * managers.length)];
  }

  async findAll(filters: EmployeeFilters): Promise<PaginatedEmployees> {
    try {
      const [employees, total] =
        await this.employeesRepository.findByFilters(filters);

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const totalPages = Math.ceil(total / limit);

      return {
        employees,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error("Error finding employees:", error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Employee> {
    try {
      const employee = await this.employeesRepository.findOne(id);
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      return employee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding employee with ID ${id}:`, error);
      throw error;
    }
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      // Check if email already exists
      const existingEmployee = await this.employeesRepository.findByEmail(
        createEmployeeDto.email,
      );
      if (existingEmployee) {
        throw new ConflictException(
          `Employee with email ${createEmployeeDto.email} already exists`,
        );
      }

      const employeeData = {
        ...createEmployeeDto,
        avatar: `https://ui-avatars.com/api/?name=${createEmployeeDto.firstName}+${createEmployeeDto.lastName}&size=200`,
        hireDate: new Date().toISOString().split("T")[0],
        isActive: true,
      };

      const newEmployee = await this.employeesRepository.create(employeeData);
      this.logger.log(`Created new employee: ${newEmployee.id}`);
      return newEmployee;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error("Error creating employee:", error);
      throw error;
    }
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    try {
      // Check if employee exists
      const existingEmployee = await this.employeesRepository.findOne(id);
      if (!existingEmployee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      // If email is being updated, check for conflicts
      if (
        updateEmployeeDto.email &&
        updateEmployeeDto.email !== existingEmployee.email
      ) {
        const emailExists = await this.employeesRepository.findByEmail(
          updateEmployeeDto.email,
        );
        if (emailExists) {
          throw new ConflictException(
            `Employee with email ${updateEmployeeDto.email} already exists`,
          );
        }
      }

      const updatedEmployee = await this.employeesRepository.update(
        id,
        updateEmployeeDto,
      );
      if (!updatedEmployee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      this.logger.log(`Updated employee: ${id}`);
      return updatedEmployee;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      this.logger.error(`Error updating employee with ID ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Check if employee exists
      const existingEmployee = await this.employeesRepository.findOne(id);
      if (!existingEmployee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      await this.employeesRepository.remove(id);
      this.logger.log(`Removed employee: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error removing employee with ID ${id}:`, error);
      throw error;
    }
  }

  async getDepartments(): Promise<string[]> {
    try {
      return await this.employeesRepository.getDepartments();
    } catch (error) {
      this.logger.error("Error getting departments:", error);
      throw error;
    }
  }

  async getTitles(): Promise<string[]> {
    try {
      return await this.employeesRepository.getTitles();
    } catch (error) {
      this.logger.error("Error getting titles:", error);
      throw error;
    }
  }

  async getLocations(): Promise<string[]> {
    try {
      return await this.employeesRepository.getLocations();
    } catch (error) {
      this.logger.error("Error getting locations:", error);
      throw error;
    }
  }
}
