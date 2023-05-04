import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";
import voucherFactory from "./voucher-factory";

describe('Apply Voucher', () => {

  it("should apply voucher", async () => {
    const voucher = await voucherFactory.createVoucherFactory();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

    jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce({ ...voucher, used: true })
    
    const amount = voucherFactory.generateValue(100, 300);
    const promise = voucherService.applyVoucher(voucher.code, amount);
    await expect(promise).resolves.not.toThrow();
    expect(voucherRepository.useVoucher).toBeCalled();
})

  it('should not apply discount for values less that 100', async () => {
    const voucher = await voucherFactory.createVoucherFactory();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementation((): any => { return {
      id: 1,
      code: voucher.code,
      discount: voucher.discount,
      used: false
    };});

    jest.spyOn(voucherRepository, "useVoucher").mockImplementation((): any => { });

    const order = await voucherService.applyVoucher("AAA", voucher.discount);
    expect(order.applied).toBe(false)
    });

  it('should not apply discount for invalid voucher', async () => {
    const voucher = await voucherFactory.createVoucherFactory();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementation((): any => { return undefined; });

    const amount = voucherFactory.generateValue(100, 300);
    const promise = voucherService.applyVoucher(voucher.code, amount);
    expect(promise).rejects.toEqual({
      message: "Voucher does not exist.",
      type: "conflict"
    })
  });

  it('should not apply discount if do not exist', async () => {
    const voucher = await voucherFactory.createVoucherFactory();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null)

    const amount = voucherFactory.generateValue(100, 300);
    const promise = voucherService.applyVoucher(voucher.code, amount);
    await expect(promise).rejects.toEqual({
      message: "Voucher does not exist.",
       type:"conflict"
    })
})
});

describe('Create Voucher', () => {
  it('should create voucher', async () => {
    const voucher = await voucherFactory.createVoucherFactory();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);

    jest.spyOn(voucherRepository, "createVoucher").mockResolvedValueOnce(voucher);
    
    const promise = voucherService.createVoucher;

    await expect(promise).resolves.not.toThrow();
    expect(voucherRepository.createVoucher).toBeCalled();
});

  it('should not create voucher if code already exist', async () => {
    const voucher = await voucherFactory.createVoucherFactory();
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

    jest.spyOn(voucherRepository, "createVoucher").mockResolvedValueOnce(null);

    const promise = voucherService.createVoucher(voucher.code, voucher.discount);
    expect(promise).rejects.toEqual({
        message:"Voucher already exist.",
        type: "conflict"
    });
  });
});