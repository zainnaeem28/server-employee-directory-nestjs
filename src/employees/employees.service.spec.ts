import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { EmployeesService } from "./employees.service";
import { EmployeesRepository } from "./repositories/employees.repository";
import { Employee } from "./entities/employee.entity";
import { CreateEmployeeDto } from "../common/dto/create-employee.dto";
import { UpdateEmployeeDto } from "../common/dto/update-employee.dto";
import { NotFoundException, ConflictException } from "@nestjs/common";

describe("EmployeesService", () => {
  let service: EmployeesService;
  let repository: EmployeesRepository;

  const mockEmployee: Employee = {
    id: "test-id",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    department: "Engineering",
    title: "Software Engineer",
    location: "New York, USA",
    avatar: "https://example.com/avatar.jpg",
    hireDate: "2023-01-15",
    salary: 75000,
    manager: "Jane Smith",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    fullName: "John Doe",
  };

  const mockRepository = {
    findByFilters: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getDepartments: jest.fn(),
    getTitles: jest.fn(),
    getLocations: jest.fn(),
    count: jest.fn(),
    seedEmployees: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: EmployeesRepository,
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    repository = module.get<EmployeesRepository>(EmployeesRepository);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return paginated employees", async () => {
      const filters = { page: 1, limit: 10 };
      const mockResult = [[mockEmployee], 1];

      mockRepository.findByFilters.mockResolvedValue(mockResult);

      const result = await service.findAll(filters);

      expect(repository.findByFilters).toHaveBeenCalledWith(filters);
      expect(result).toEqual({
        employees: [mockEmployee],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it("should handle errors when finding employees", async () => {
      const filters = { page: 1, limit: 10 };
      const error = new Error("Database error");

      mockRepository.findByFilters.mockRejectedValue(error);

      await expect(service.findAll(filters)).rejects.toThrow("Database error");
    });
  });

  describe("findOne", () => {
    it("should return an employee by id", async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);

      const result = await service.findOne("test-id");

      expect(repository.findOne).toHaveBeenCalledWith("test-id");
      expect(result).toEqual(mockEmployee);
    });

    it("should throw NotFoundException when employee not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne("non-existent")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("create", () => {
    it("should create a new employee", async () => {
      const createDto: CreateEmployeeDto = {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "+1234567890",
        department: "Marketing",
        title: "Marketing Manager",
        location: "Los Angeles, USA",
        salary: 80000,
      };

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockEmployee);

      const result = await service.create(createDto);

      expect(repository.findByEmail).toHaveBeenCalledWith(createDto.email);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        avatar: expect.any(String),
        hireDate: expect.any(String),
        isActive: true,
      });
      expect(result).toEqual(mockEmployee);
    });

    it("should throw ConflictException when email already exists", async () => {
      const createDto: CreateEmployeeDto = {
        firstName: "Jane",
        lastName: "Smith",
        email: "existing@example.com",
        phone: "+1234567890",
        department: "Marketing",
        title: "Marketing Manager",
        location: "Los Angeles, USA",
        salary: 80000,
      };

      mockRepository.findByEmail.mockResolvedValue(mockEmployee);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe("update", () => {
    it("should update an existing employee", async () => {
      const updateDto: UpdateEmployeeDto = {
        firstName: "John Updated",
        salary: 85000,
      };

      mockRepository.findOne.mockResolvedValue(mockEmployee);
      mockRepository.update.mockResolvedValue({
        ...mockEmployee,
        ...updateDto,
      });

      const result = await service.update("test-id", updateDto);

      expect(repository.findOne).toHaveBeenCalledWith("test-id");
      expect(repository.update).toHaveBeenCalledWith("test-id", updateDto);
      expect(result).toEqual({ ...mockEmployee, ...updateDto });
    });

    it("should throw NotFoundException when employee not found", async () => {
      const updateDto: UpdateEmployeeDto = { firstName: "Updated" };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update("non-existent", updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("remove", () => {
    it("should remove an existing employee", async () => {
      mockRepository.findOne.mockResolvedValue(mockEmployee);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove("test-id");

      expect(repository.findOne).toHaveBeenCalledWith("test-id");
      expect(repository.remove).toHaveBeenCalledWith("test-id");
    });

    it("should throw NotFoundException when employee not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove("non-existent")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("getDepartments", () => {
    it("should return list of departments", async () => {
      const departments = ["Engineering", "Marketing", "Sales"];
      mockRepository.getDepartments.mockResolvedValue(departments);

      const result = await service.getDepartments();

      expect(repository.getDepartments).toHaveBeenCalled();
      expect(result).toEqual(departments);
    });
  });

  describe("getTitles", () => {
    it("should return list of titles", async () => {
      const titles = ["Software Engineer", "Marketing Manager"];
      mockRepository.getTitles.mockResolvedValue(titles);

      const result = await service.getTitles();

      expect(repository.getTitles).toHaveBeenCalled();
      expect(result).toEqual(titles);
    });
  });

  describe("getLocations", () => {
    it("should return list of locations", async () => {
      const locations = ["New York, USA", "Los Angeles, USA"];
      mockRepository.getLocations.mockResolvedValue(locations);

      const result = await service.getLocations();

      expect(repository.getLocations).toHaveBeenCalled();
      expect(result).toEqual(locations);
    });
  });
});
