from pydantic import BaseModel

class FallDetectionInput(BaseModel):
    accel_x_list: float
    accel_y_list: float
    accel_z_list: float
    gyro_x_list: float
    gyro_y_list: float
    gyro_z_list: float
    orientation_s_list: float
    orientation_i_list: float
    orientation_j_list: float
    orientation_k_list: float
