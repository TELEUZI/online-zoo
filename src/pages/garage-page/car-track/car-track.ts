import CarsService from '@/services/car-service';
import { startDrive, startEngine, stopEngine } from '@/api/engine-api';
import type { ICar } from '@/interfaces/car-api';
import BaseComponent from '@/components/base-component';
import Button from '@/components/button/button';
import Icon from '@/components/menu/icon/icon';
import EditButton from '@/pages/garage-page/edit-button/edit-button';
import AnimationControls from '@/components/controls/animation-controls/animation-controls';
import Car from '../car/car';

const VELOCITY_MULTIPLIER = 2;
export default class CarTrack extends BaseComponent {
  private readonly car: Car;

  private readonly animationControls: AnimationControls;

  private readonly id: number;

  updateButton: EditButton;

  deleteButton: Button;

  constructor({ id, name, color }: ICar, private onUpdate?: () => void) {
    super('div', ['car-track']);
    this.id = id;
    this.car = new Car(name, color);
    this.animationControls = new AnimationControls(
      this.animateCar.bind(this),
      this.stopCarAnimation.bind(this),
      ['car-track__animation-controls'],
    );
    this.updateButton = new EditButton(this.editCar.bind(this));
    this.deleteButton = new Button('Delete', ['delete-button'], this.deleteCar.bind(this));
    const icon = new Icon(['finish-flag']);
    this.appendChildren([
      icon,
      this.animationControls,
      this.car,
      this.deleteButton,
      this.updateButton,
    ]);
  }

  private editCar(): void {
    this.car.toggleUpdateMode();
    this.updateButton.moveToSubmitState(this.submit.bind(this));
  }

  private submit(): void {
    CarsService.updateCar(this.id, this.car.getName(), this.car.getColor()).then(() => {
      this.car.toggleUpdateMode();
      this.car.updateValuesFromForm();
      this.updateButton.moveToEditState(this.editCar.bind(this));
    });
  }

  deleteCar(): void {
    CarsService.deleteCar(this.id).then(() => {
      this.destroy();
      this.onUpdate?.();
    });
  }

  async animateCar(): Promise<ICar> {
    const chars = await startEngine(this.id);
    this.car.startAnimation(`${(chars.distance / chars.velocity) * VELOCITY_MULTIPLIER}ms`);
    return new Promise((resolve) =>
      startDrive(this.id).then((res) => {
        if (res.success)
          resolve({
            id: this.id,
            name: this.car.getName(),
            color: this.car.getColor(),
          });
        else {
          this.pauseAnimation();
        }
      }),
    );
  }

  async stopCarAnimation(): Promise<void> {
    await stopEngine(this.id);
    this.car.stopAnimation();
  }

  private pauseAnimation(): void {
    this.car.pauseAnimation();
  }
}
