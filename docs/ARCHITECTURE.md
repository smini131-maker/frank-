# 소프트웨어 구조

1. 카메라를 한 번 초기화하고 노출을 안정화한다.
2. 비어 있는 인식 구역의 기준 배경을 수집한다.
3. ROI 변화율과 연속 프레임 조건으로 물체 진입을 감지한다.
4. 1차 6분류 TFLite 모델이 `background`, `can`, `clear_pet`, `plastic`, `paper`, `other`를 판별한다.
5. 1차 결과가 `clear_pet` 또는 `plastic`이면 2차 전문 모델로 재판별한다.
6. 결과 WAV를 재생하고 해당 분류 칸의 서보만 개방한다.
7. LOCKED 상태에서 같은 물체의 반복 인식을 막고 물체 제거 후 WAITING으로 복귀한다.
8. systemd 서비스로 노트북과 인터넷 없이 Raspberry Pi에서 독립 실행한다.

| 파일 | 역할 |
|---|---|
| `smart_bin_final.py` | PIR, AI, 음성, 서보 최종 통합 |
| `smart_bin_camera_ai.py` | 카메라, 배경 차분, 1차 모델 상태 머신 |
| `smart_bin_camera_ai_specialist.py` | PET/플라스틱 2차 모델 결합 |
| `pet_plastic_specialist_runtime.py` | 2차 TFLite 추론 |
| `smart_bin_hardware.py` | PCA9685, MG90S, ALSA WAV 제어 |
| `hardware_config.json` | 채널, 각도, 음성, 동작 설정 |
