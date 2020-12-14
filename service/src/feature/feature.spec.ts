import * as uuid from 'uuid'
import { createService } from './feature'
import { Flag } from './flag'
describe('Feature', () => {
  it('can get feature status', async () => {
    const mockKey = uuid.v4()
    const mockFlags: Flag[] = [
      { name: 'something', enabled: true, predicates: [] },
    ]

    const mockRespository = {
      getFlagsByFeatureKey: jest
        .fn()
        .mockReturnValue(Promise.resolve(mockFlags)),
      getFeaturesByUserId: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    }

    const service = createService(mockRespository)
    const result = await service.getStatus(mockKey, {})
    expect(result).toBe(true)
  })
})
