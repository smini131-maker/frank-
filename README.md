# 시각장애인 및 저시력자를 위한 AI 인식 기반 선택 개방형 스마트 분리수거함

제24회 임베디드SW경진대회 출품작 소스코드입니다.

사용자가 쓰레기를 카메라 인식 구역에 보여주면 Raspberry Pi 5에서 두 단계 TFLite 분류를 수행합니다. 판정 결과를 음성으로 안내하고, 캔·투명 페트병·플라스틱 용기·종이 중 해당 칸의 뚜껑만 서보모터로 자동 개방합니다. 시각장애인과 저시력 사용자가 수거함의 글자나 위치를 직접 확인하지 않고도 분리배출할 수 있도록 설계했습니다.

## 핵심 기능

- Camera Module 3 기반 실시간 물체 진입 감지
- MobileNetV2 기반 1차 6분류 모델
- 투명 PET와 플라스틱 용기 구분을 위한 2차 전문 모델
- WAV 음성 안내
- PCA9685와 MG90S를 이용한 선택 개방
- PIR 접근 감지 후 준비 안내 1회 재생
- 동일 물체 중복 인식 방지 및 제거 안내
- systemd 부팅 자동 실행과 오프라인 독립 동작

## 분류 및 서보 채널

| 분류 | 모델 라벨 | PCA9685 채널 |
|---|---|---:|
| 캔 | `can` | 0 |
| 투명 페트병 | `clear_pet` | 4 |
| 플라스틱 용기 | `plastic` | 11 |
| 종이 | `paper` | 15 |

`other`, 불확실, 시간초과 결과에서는 뚜껑을 열지 않습니다.

## 빠른 실행

```bash
cd /home/smini131/smart_bin
python3 -m venv --system-site-packages .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python generate_audio.py
python -u smart_bin_final.py
```

부팅 자동 실행:

```bash
chmod +x systemd/install_service.sh
./systemd/install_service.sh
```

로그 확인:

```bash
sudo journalctl -u smart-bin.service -f
```

## 저장소 구조

```text
.
├── smart_bin_final.py
├── smart_bin_camera_ai.py
├── smart_bin_camera_ai_specialist.py
├── pet_plastic_specialist_runtime.py
├── smart_bin_hardware.py
├── hardware_config.json
├── model/
├── audio/
├── tests/
├── training/
├── systemd/
└── docs/
```

## 문서

- [소프트웨어 구조](docs/ARCHITECTURE.md)
- [하드웨어 구성 및 배선](docs/HARDWARE_WIRING.md)
- [AI 모델 정보](docs/AI_MODEL.md)
- [대회 제출 확인표](docs/CONTEST_SUBMISSION.md)

## 주의

- `hardware_config.json`의 열림·닫힘 각도는 기구물에 맞게 반드시 개별 보정해야 합니다.
- PCA9685의 VCC는 Raspberry Pi 3.3V 로직 전원이며, V+는 외부 서보 전원입니다.
- 서보 전원은 Raspberry Pi 5V 핀에서 공급하지 않습니다.
- AI Hub 원본 학습 데이터는 이용약관 및 용량 문제로 저장소에 포함하지 않습니다.

## 개발자

정승민

## 사용 범위

본 저장소는 제24회 임베디드SW경진대회 심사와 작품 재현을 위한 공개 소스입니다. 외부 데이터와 제3자 구성요소는 각 제공처의 이용약관을 따릅니다.
